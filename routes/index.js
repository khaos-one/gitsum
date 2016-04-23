var express = require('express');
var router = express.Router();

var git = require('nodegit-kit');
var promise = require('promise');

var reposConfig = require('../repositories.json');

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