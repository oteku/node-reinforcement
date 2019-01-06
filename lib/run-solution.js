var fs = require('fs');
var path = require('path');
var docs = path.join(__dirname, 'docs');
var cp = require('child_process');

/**
 * @param {!string} filePath
 * @return {Promise}
 */
function exists(filePath) {
  return new Promise(function(res, rej) {
    fs.stat(filePath, function(err, d) {
      if (err) {
        res(false);
      }

      res(true);
    });
  });
}

/**
 * @param {!string} filePath
 * @return {Promise}
 */
function executeSolution(filePath) {
  const { stdout, error } = cp.spawnSync('node', [filePath], {
    stdio: 'pipe',
  });
  // console.log(stdout.toString(), error);
  return error ? Promise.reject(error) : Promise.resolve(stdout.toString());
  // return new Promise(function(res, rej) {
  //   // cp.exec(`node ${filePath}`, { stdio: 'inherit' }, (err, stdout, stderr) => {
  //   //   if (err) {
  //   //     return rej(err);
  //   //   }
  //   //   return res(stdout);
  //   // });

  // });
}

/**
 * @param {string} solutionPath
 * @param {function} cb
 */
module.exports = (solutionPath, cb) => {
  exists(solutionPath)
    .then(function(solutionExists) {
      if (!solutionExists) {
        throw new Error('Solution file is missing', {
          exerciseFile: solutionPath,
        });
      }

      return executeSolution(solutionPath);
    })
    .then(function(stdout) {
      cb(null, stdout);
    })
    .catch(err => {
      cb(err);
    });
};
