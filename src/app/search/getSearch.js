const action = (req, res) => {
  res.render('search/views/search', {
    csrfToken: req.csrfToken(),
    system: 'EAS',
    criteria: '',
    users: null,
  });
};

module.exports = action;
