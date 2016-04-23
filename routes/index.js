const express = require('express');
const router = express.Router();
const git = require('nodegit-kit');
const promise = require('promise');

const reposConfig = require('../repositories.json');

/* GET home page. */
router.get('/', function (req, res) {
  var repositories = [];
  var promises = [];
  reposConfig.forEach(function (item) {
    promises.push(
      git.open(item.path, { init: false })
        .then(function (repo) {
          // Get repository log.
          return git.log(repo, { sort: 'time' })
            .then(function (log) {
              repositories.push({ 
                name: item.name, 
                path: item.path, 
                description: item.description,
                url: item.url,
                log: log,
                isBroken: false 
            });
          });
        })
        .catch(function () {
          // No repository found.
          repositories.push({ 
            name: item.name, 
            path: item.path,
            description: item.description,
            url: item.url,
            log: [],
            isBroken: true 
        });
      }));
});

	promise.all(promises)
      .then(function () {
        res.render('index', { repositories: repositories });
    });
});

module.exports = router;