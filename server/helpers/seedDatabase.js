'use strict';
var fs = require('fs');
var dateToEpoch = require('./dateToEpoch');
var delayedArrayLoop = require('./delayedArrayLoop');
var apiAccess = require('../databaseOperations/schemas/ApiAccess');

/**
 * Används som helper för att samla historisk data när en användare lägger till en ny access.
 */

// inehåller en array med timestamps från 1 Januari 2016, därefter varje månad till Maj 2017
var timeStamps = JSON.parse(fs.readFileSync(__dirname + '/timestamps.json', 'utf8'));
var cronJob = require('../cronJob');

/**
 *
 */
function addDate() {
  var date = dateToEpoch(Date.now());
  timeStamps.dates.push(date);
  var json = JSON.stringify(timeStamps);
  fs.writeFileSync(__dirname + '/timestamps.json', json);
}

/**
 *
 * @access ett access Objekt från databasen.
 * Går igenom alla datum i arrayen och anropar APIerna
 * Anropar samma funktion som när
 */
function seedDatabase(access) {
  delayedArrayLoop(timeStamps.dates, function (timeStamp) {
    cronJob.updateEach(access, timeStamp);
  }, 10000);
}

function seedEntireDatabase() {
  delayedArrayLoop(timeStamps.dates, function (timeStamp) {
    cronJob.monthly(timeStamp);
  }, 10000);
}

function forUser(id) {
  apiAccess.findOne({ user: id }).then(function (access) {

    // tar bort apier som inte ger historisk data,
    // for att undvika att de populerar databasen med samma manader.
    if (access) {
      var historicalOnly = access._doc;
      historicalOnly.twitter = null;
      historicalOnly.tynt = null;
      seedDatabase(historicalOnly);
    } else {
      console.error('no access returned');
    }

  });
}

exports.seed = seedDatabase;
exports.addDate = addDate;
exports.seedEntire = seedEntireDatabase;
exports.forUser = forUser;
