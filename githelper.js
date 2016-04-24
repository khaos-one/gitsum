const git = require('nodegit-kit');
const async = require('async');

module.exports.getLog = function getLog(repoPath, callback) {
  git.open(repoPath, { init: false })
    .then(function afterGitOpen(repo) {
      return git.log(repo, { sort: 'time' })
        .then(function afterGitGetLog(log) {
          callback(null, log);
        });
    })
    .catch(function errorGitOpen(error) {
      callback(error, null);
    });
};

module.exports.getLogWithPathes = function getLogWithPathes(repoPath, callback) {
  module.exports.getLog(repoPath, function (error, result) {
    if (error) {
      callback(error, null);
    }
    else {
      for (var i = 0; i < result.length; i++) {
        result[i].path = repoPath;
      }

      callback(null, result);
    }
  });
};

module.exports.getLogWithRepoName = function getLogWithRepoName(repoInfo, callback) {
  module.exports.getLog(repoInfo.path, function (error, result) {
    if (error) {
      callback(error, null);
    }
    else {
      for (var i = 0; i < result.length; i++) {
        result[i].path = repoInfo.path;
        result[i].name = repoInfo.name;
      }

      callback(null, result);
    }
  });
};
