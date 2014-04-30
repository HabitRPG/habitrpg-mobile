/* 
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var admobExport = {};

/**
 * This enum represents AdMob's supported ad sizes.  Use one of these
 * constants as the adSize when calling createBannerView.
 * @const
 */
admobExport.AD_SIZE = {
  BANNER: 'BANNER',
  IAB_MRECT: 'IAB_MRECT',
  IAB_BANNER: 'IAB_BANNER',
  IAB_LEADERBOARD: 'IAB_LEADERBOARD',
  SMART_BANNER: 'SMART_BANNER'
};

/**
 * Creates a new AdMob banner view.
 *
 * @param {!Object} options The options used to create a banner.  They should
 *        be specified similar to the following.
 *
 *        {
 *          'publisherId': 'MY_PUBLISHER_ID',
 *          'adSize': AdMob.AD_SIZE.AD_SIZE_CONSTANT,
 *          'positionAtTop': false
 *        }
 *
 *        publisherId is the publisher ID from your AdMob site, adSize
 *        is one of the AdSize constants, and positionAtTop is a boolean to
 *        determine whether to create the banner above or below the app content.
 *        A publisher ID and AdSize are required.  The default for postionAtTop
 *        is false, meaning the banner would be shown below the app content.
 * @param {function()} successCallback The function to call if the banner was
 *         created successfully.
 * @param {function()} failureCallback The function to call if create banner
 *         was unsuccessful.
 */
admobExport.createBannerView =
function(options, successCallback, failureCallback) {
  var defaults = {
    'publisherId': undefined,
    'adSize': undefined,
    'bannerAtTop': false
  };
  var requiredOptions = ['publisherId', 'adSize'];

  // Merge optional settings into defaults.
  for (var key in defaults) {
    if (typeof options[key] !== 'undefined') {
      defaults[key] = options[key];
    }
  }

  // Check for and merge required settings into defaults.
  requiredOptions.forEach(function(key) {
    if (typeof options[key] === 'undefined') {
      failureCallback('Failed to specify key: ' + key + '.');
      return;
    }
    defaults[key] = options[key];
  });

  cordova.exec(
      successCallback,
      failureCallback,
      'AdMob',
      'createBannerView',
      [defaults['publisherId'], defaults['adSize'], defaults['bannerAtTop']]
  );
};

/**
 * Creates a new AdMob interstitial view.
 *
 * @param {!Object} options The options used to create a interstitial.  They should
 *        be specified similar to the following.
 *
 *        {
 *          'publisherId': 'MY_PUBLISHER_ID'
 *        }
 *
 *        publisherId is the publisher ID from your AdMob site, which is required.  
 * @param {function()} successCallback The function to call if the interstitial was
 *         created successfully.
 * @param {function()} failureCallback The function to call if create interstitial
 *         was unsuccessful.
 */
admobExport.createInterstitialView =
function(options, successCallback, failureCallback) {
  var defaults = {
    'publisherId': undefined
  };
  var requiredOptions = ['publisherId'];

  // Merge optional settings into defaults.
  for (var key in defaults) {
    if (typeof options[key] !== 'undefined') {
      defaults[key] = options[key];
    }
  }

  // Check for and merge required settings into defaults.
  requiredOptions.forEach(function(key) {
    if (typeof options[key] === 'undefined') {
      failureCallback('Failed to specify key: ' + key + '.');
      return;
    }
    defaults[key] = options[key];
  });

  cordova.exec(
      successCallback,
      failureCallback,
      'AdMob',
      'createInterstitialView',
      [defaults['publisherId']]
  );
};

admobExport.destroyBannerView =
function(options, successCallback, failureCallback) {
  cordova.exec(
	      successCallback,
	      failureCallback,
	      'AdMob',
	      'destroyBannerView',
	      []
	  );
};

/**
 * Request an AdMob ad.  This call should not be made until after the banner
 * view has been successfully created.
 *
 * @param {!Object} options The options used to request an ad.  They should
 *        be specified similar to the following.
 *
 *        {
 *          'isTesting': true|false,
 *          'extras': {
 *            'key': 'value'
 *          }
 *        }
 *
 *        isTesting is a boolean determining whether or not to request a
 *        test ad on an emulator, and extras represents the extras to pass
 *        into the request. If no options are passed, the request will have
 *        testing set to false and an empty extras.
 * @param {function()} successCallback The function to call if an ad was
 *        requested successfully.
 * @param {function()} failureCallback The function to call if an ad failed
 *        to be requested.
 */

admobExport.requestAd =
function(options, successCallback, failureCallback) {
  var defaults = {
    'isTesting': false,
    'extras': {}
  };

  for (var key in defaults) {
    if (typeof options[key] !== 'undefined') {
      defaults[key] = options[key];
    }
  }

  cordova.exec(
      successCallback,
      failureCallback,
      'AdMob',
      'requestAd',
      [defaults['isTesting'], defaults['extras']]
  );
};

/**
 * Request an AdMob interstitial ad.  This call should not be made until after the banner
 * view has been successfully created.
 *
 * @param {!Object} options The options used to request an ad.  They should
 *        be specified similar to the following.
 *
 *        {
 *          'isTesting': true|false,
 *          'extras': {
 *            'key': 'value'
 *          }
 *        }
 *
 *        isTesting is a boolean determining whether or not to request a
 *        test ad on an emulator, and extras represents the extras to pass
 *        into the request. If no options are passed, the request will have
 *        testing set to false and an empty extras.
 * @param {function()} successCallback The function to call if an ad was
 *        requested successfully.
 * @param {function()} failureCallback The function to call if an ad failed
 *        to be requested.
 */

admobExport.requestInterstitialAd =
function(options, successCallback, failureCallback) {
  var defaults = {
    'isTesting': false,
    'extras': {}
  };

  for (var key in defaults) {
    if (typeof options[key] !== 'undefined') {
      defaults[key] = options[key];
    }
  }

  cordova.exec(
      successCallback,
      failureCallback,
      'AdMob',
      'requestInterstitialAd',
      [defaults['isTesting'], defaults['extras']]
  );
};

/*
 * Show or hide Ad.
 * 
 * @param {boolean} show true to show, false to hide.  
 * @param {function()} successCallback The function to call if an ad was
 *        requested successfully.
 * @param {function()} failureCallback The function to call if an ad failed
 *        to be requested.
 */
admobExport.showAd = 
function( show, successCallback, failureCallback) {
	if (show === undefined) {
		show = true;
	}

	cordova.exec(
		successCallback,
		failureCallback, 
		'AdMob', 
		'showAd', 
		[ show ]
	);
};

module.exports = admobExport;

