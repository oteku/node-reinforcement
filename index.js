const nrw = require('workshopper-adventure')({
  appDir: __dirname,
  languages: ['en'],
  header: require('workshopper-adventure/default/header'),
  footer: require('workshopper-adventure/default/footer.js'),
});

nrw.addAll(
  require('./menu.json').map(problem => {
    return {
      name: problem,
      fn: () => {
        const p = problem.toLowerCase().replace(/\s/g, '-');
        const dir = require('path').join(__dirname, 'problems', p);
        return require(dir);
      },
    };
  })
);

module.exports = nrw;
