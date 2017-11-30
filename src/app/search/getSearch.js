const action = (req, res) => {
  res.render('search/views/search', {
    csrfToken: req.csrfToken(),
    system: 'OSA',
    criteria: '',
    users: null,
  });
};

module.exports = action;
