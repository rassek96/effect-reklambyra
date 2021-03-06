'use strict';

var dotenv = require('dotenv');
var epochToDate = require('../helpers/epochToDate');
var decrypt = require('../helpers/decrypt');
var errorHandler = require('../errorHandler');

dotenv.load();

//  https://github.com/jlobos/neo-instagram
var Instagram = require('neo-instagram');
var client = new Instagram({
  client_id: process.env.INSTAGRAM_CLIENT_ID,
  client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
});
var relevantDate;

/**
 * Even though our access tokens do not specify an expiration time, your app should handle
 * the case that either the user revokes access, or Instagram expires the token after some period
 * of time. If the token is no longer valid, API responses will contain an
 * “error_type=OAuthAccessTokenException”. In this case you will need to re-authenticate
 * the user to obtain a new valid token.
 In other words: do not assume your access_token is valid forever.
 * @param access
 * @timeStamp something
 */

module.exports = function (access, timeStamp) {
  //  todo adding count: -1 or higher may increase amount of medias outside of sandbox
  var tokenObj = { access_token: decrypt.decryptText(access.accessToken) };
  relevantDate = epochToDate(timeStamp);

  return new Promise(function (resolve) {
    client.get('users/self/media/recent', tokenObj).then(function (user) {

      if (!user.data)  {
        errorHandler.APIResolve(access, user, 'instagram');
      }

      var returnObj = { instagram: filterByMonthYear(user.data) };
      resolve(returnObj);
    });
  });
};

function filterByMonthYear(recentMedias) {
  var relevantMedias = [];
  recentMedias.forEach(function (media) {
    var mediaDate = epochToDate(media.created_time);

    // checks the media creation date to ensure it matches the intended period.
    if (mediaDate.month === relevantDate.month && mediaDate.year === relevantDate.year) {
      relevantMedias.push(media);
    }
  });

  return countInstagramStatsFor(relevantMedias);
}

function countInstagramStatsFor(relevantMedias) {
  var totalLikes = 0;
  var totalComments = 0;
  var totalTags = 0;
  var totalTaggedUsers = 0;

  relevantMedias.forEach(function (media) {
    totalLikes += media.likes.count;
    totalComments += media.comments.count;
    totalTags += media.tags.length;
    totalTaggedUsers += media.users_in_photo.length;
  });

  return {
    likes: totalLikes,
    comments: totalComments,
    tags: totalTags,
    taggedUsers: totalTaggedUsers,
  };
}
