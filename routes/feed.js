const express = require('express');
const router = express.Router();
const git = require('nodegit-kit');
const async = require('async');
const githelper = require('../githelper');

const reposConfig = require('../repositories.json');

/* GET /feed */
router.get('/', function (req, res) {
  // Get repository infos.
  async.map(reposConfig, githelper.getLogWithRepoName, function (error, result) {
    if (error) {
      throw error;
    }
    else {
      var log = [];

      // Plainify and sort resulting array.
      for (var i = 0; i < result.length; i++) {
        log = log.concat(result[i]);
      }
      log.sort(function (a, b) {
        return b.date.getTime() - a.date.getTime();
      });

      // Truncate array and group items by days.
      log = log.slice(0, 30);
      
      // TODO: Finish array formatting by days.

      // Render the page.
      res.render('feed/index', { feed: log });
    }
  })
});

module.exports = router;
