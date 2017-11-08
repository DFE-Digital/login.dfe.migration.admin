const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const logger = require('./infrastructure/logger');
const https = require('https');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const { getPassportStrategy } = require('./infrastructure/oidc');
const { isLoggedIn } = require('./infrastructure/utils');

const search = require('./app/search');

const app = express();
const config = require('./infrastructure/config');

const init = async () => {
  // Session
  app.use(cookieParser());
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.hostingEnvironment.sessionSecret
  }));

  // Auth
  passport.use('oidc', await getPassportStrategy());
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/auth', passport.authenticate('oidc'));
  app.get('/auth/cb', (req, res, next) => {
    passport.authenticate('oidc', (err, user, info) => {
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

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        if (redirectUrl.endsWith('signout/complete')) redirectUrl = '/';
        res.redirect(redirectUrl);
      });
    })(req, res, next)
  });
  app.use(isLoggedIn);

  // Postbacks
  app.use(bodyParser.urlencoded({ extended: true }));

  // Logging
  app.use(morgan('combined', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
  app.use(morgan('dev'));

  // Views
  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, 'app'));
  app.use(expressLayouts);
  app.set('layout', 'layouts/layout');

  // Routes
  app.use('/', search());

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