const action = (req, res) => {
  res.render('search/views/search', {
    csrfToken: req.csrfToken(),
    criteria: '',
    users: null,
  });
};

module.exports = action;