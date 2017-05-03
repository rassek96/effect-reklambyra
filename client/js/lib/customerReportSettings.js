const googleAPI = require('./../../../model/googleApi');

function customerReportSettings(req, res, next) {
  var form = {

    customer: req.body.customer || 'Kund',
    adwords: {
      active: req.body.adwords,
      features: {
        adwordsClick: req.body.adwordsClick,
        adwordsCpc: req.body.adwordsCpc,
        adwordsViews: req.body.adwordsViews
      }
    },
    facebook: {
      active: req.body.facebook,
      features: {
        facebookLikes: req.body.facebookLikes
      }
    },
    youtube: {
      active: req.body.youtube,
      features: {
        youtubeViews: req.body.youtubeViews
      }
    },
    tynt: {
      active: req.body.tynt,
      features: {
        tyntCopied: req.body.tyntCopied
      }
    },
    addthis: {
      active: req.body.addthis,
      features: {
        addthisClick: req.body.addthisClick
      }
    },
    twitter: {
      active: req.body.twitter,
      features: {
        twitterViews: req.body.twitterViews
      }
    },
    analytics: {
      active: req.body.analytics,
      features: {
        analyticsViews: req.body.analyticsViews,
        analyticsUniqueViews: req.body.analyticsUniqueViews,
        analyticsStrongestRedirects: req.body.analyticsStrongestRedirects,
        analyticsMostVisitedPages: req.body.analyticsMostVisitedPages,
        analyticsAverageTime: req.body.analyticsAverageTime,
        analyticsAverageVisitedPerPages: req.body.analyticsAverageVisitedPerPages
      }
    },
    linkedin: {
      active: req.body.linkedin,
      features: {
        linkedinFollowers: req.body.linkedinFollowers,
        linkedinInteractions: req.body.linkedinInteractions
      }
    },
    moz: {
      active: req.body.moz,
      features: {
        mozKeywords: req.body.mozKeywords
      }
    }
  };

  googleAPI(req.user.accessToken, function (results) {
    if (req.body.youtube === 'on') {
      if (req.body.youtubeViews === 'on' && results.youtubeViews) {
        form.youtube.features.youtubeViews = results.youtubeViews;
      }
    }
    if (req.body.analytics === 'on') {
      if (req.body.analyticsViews === 'on' && results.analytics.analyticsViews) {
        form.analytics.features.analyticsViews = results.analytics.analyticsViews;
      }
      if (req.body.analyticsUniqueViews === 'on' && results.analytics.analyticsUniqueViews) {
        form.analytics.features.analyticsUniqueViews = results.analytics.analyticsUniqueViews;
      }
      if (req.body.analyticsStrongestRedirects === 'on' && results.analytics.analyticsStrongestRedirects) {
        form.analytics.features.analyticsStrongestRedirects = results.analytics.analyticsStrongestRedirects;
      }
      if (req.body.analyticsMostVisitedPages === 'on' && results.analytics.analyticsMostVisitedPages) {
        form.analytics.features.analyticsMostVisitedPages = results.analytics.analyticsMostVisitedPages;
      }
      if (req.body.analyticsAverageTime === 'on' && results.analytics.analyticsAverageTime) {
        form.analytics.features.analyticsAverageTime = results.analytics.analyticsAverageTime;
      }
      if (req.body.analyticsAverageVisitedPerPages === 'on' && results.analytics.analyticsAverageVisitedPerPages) {
        form.analytics.features.analyticsAverageVisitedPerPages = results.analytics.analyticsAverageVisitedPerPages;
      }
    }
    res.render('preview', { user: req.user, form: JSON.stringify(form) });
  });
}

module.exports = customerReportSettings;
