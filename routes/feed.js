const express = require('express');
const router = express.Router();
const git = require('nodegit-kit');
const async = require('async');
const githelper = require('../githelper');
const moment = require('moment');

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
      var totalActivityCount = log.length;
      log = log.slice(0, 50);
      var shawnActivitiesCount = log.length;
      
      // TODO: Finish array formatting by days.
      var feed = [];

      for (var i = 0; i < log.length; i++) {
        var found = false;

        for (var j = 0; j < feed.length; j++) {
          if (moment(log[i].date).isSame(feed[j].date, 'day')) {
            feed[j].activity.push(log[i]);
            found = true;
            break;
          }
        }

        if (!found) {
          feed.push({ 
            date: log[i].date, 
            activity: [log[i]]
          });
        }
      }

      // Render the page.
      res.render('feed/index', { 
        feed: feed, 
        totalActivityCount: totalActivityCount,
        shawnActivitiesCount: shawnActivitiesCount 
      });
    }
  })
});

module.exports = router;
