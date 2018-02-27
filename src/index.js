const config = require('./infrastructure/config');
const logger = require('./infrastructure/logger');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');

const https = require('https');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const csrf = require('csurf');
const flash = require('express-flash-2');
const { getPassportStrategy } = require('./infrastructure/oidc');
const { isLoggedIn } = require('./infrastructure/utils');

const search = require('./app/search');
const invite = require('./app/invite');
const healthCheck = require('login.dfe.healthcheck');

const app = express();

const { migrationAdminSchema, validateConfig } = require('login.dfe.config.schema');
const helmet = require('helmet');
const sanitization = require('login.dfe.sanitization');

const init = async () => {
  const useStrictValidation = config.hostingEnvironment.env !== 'dev';
  validateConfig(migrationAdminSchema, config, logger, useStrictValidation);


  let expiryInMinutes = 30;
  const sessionExpiry = parseInt(config.hostingEnvironment.sessionCookieExpiryInMinutes);
  if (!isNaN(sessionExpiry)) {
    expiryInMinutes = sessionExpiry;
  }

  const expiryDate = new Date(Date.now() + (60 * expiryInMinutes * 1000));

  app.use(helmet({
    noCache: true,
    frameguard: {
      action: 'deny',
    },
  }));

  if (config.hostingEnvironment.env !== 'dev') {
    app.set('trust proxy', 1);
  }

  // Session
  app.use(cookieParser());
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.hostingEnvironment.sessionSecret,
    cookie: {
      httpOnly: true,
      secure: true,
      expires: expiryDate,
    },
  }));

  // Auth
  passport.use('oidc', await getPassportStrategy());
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/auth', passport.authenticate('oidc'));
  app.get('/auth/cb', (req, res, next) => {
    passport.authenticate('oidc', (err, user) => {
      let redirectUrl = '/';

      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/');
      }

      if (req.session.redirectUrl) {
        redirectUrl = req.session.redirectUrl;
        req.session.redirectUrl = null;
      }

      return req.logIn(user, (errLogin) => {
        if (errLogin) {
          return next(errLogin);
        }
        if (redirectUrl.endsWith('signout/complete')) redirectUrl = '/';
        return res.redirect(redirectUrl);
      });
    })(req, res, next);
  });

  // Postbacks
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(sanitization());
  app.use(csrf({
    cookie: {
      secure: true,
      httpOnly: true,
    },
  }));
  app.use(flash());

  // Logging
  app.use(morgan('combined', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
  app.use(morgan('dev'));

  // Views
  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, 'app'));
  app.use(expressLayouts);
  app.set('layout', 'layouts/layout');

  // Routes
  app.use('/healthcheck', healthCheck({ config }));

  app.use(isLoggedIn);
  app.use('/', search());
  app.use('/invite', invite());

  // Http listener
  if (config.hostingEnvironment.env === 'dev') {
    app.proxy = true;

    const options = {
      key: config.hostingEnvironment.sslKey,
      cert: config.hostingEnvironment.sslCert,
      requestCert: false,
      rejectUnauthorized: false,
    };
    const server = https.createServer(options, app);

    server.listen(config.hostingEnvironment.port, () => {
      logger.info(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port} with config:\n${JSON.stringify(config)}`);
    });
  } else {
    app.listen(process.env.PORT, () => {
      logger.info(`Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
    });
  }
};


init().catch((err) => {
  logger.error(err);
});
