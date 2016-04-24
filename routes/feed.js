const express = require('express');
const router = express.Router();
const git = require('nodegit-kit');
const async = require('async');
const githelper = require('../githelper');
require('datejs');

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
      log = log.slice(0, 50);
      
      // TODO: Finish array formatting by days.
      var feed = [];

      for (var i = 0; i < log.length; i++) {
        var found = false;

        for (var j = 0; j < feed.length; j++) {
          if (log[i].date.same().day(feed[j].date)) {
            feed[j].activity.push(log[i]);
            found = true;
            break;
          }
        }

        if (!found) {
          feed.push({ date: log[i].date, activity: [log[i]]});
        }
      }

      // Render the page.
      res.render('feed/index', { feed: feed });
    }
  })
});

module.exports = router;
