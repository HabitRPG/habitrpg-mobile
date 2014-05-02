AdMob Cordova Plugin for Android
================================

This plugin provides a way to request AdMob ads natively from JavaScript.
This plugin was written and tested with the Google AdMob SDK version 6.1.0,
and Cordova 2.0.0.
Now, it's port to Cordova 3.0.0, and tested pass.

##Requirements:

- Cordova SDK jar for Android
- Cordova JS for Android
- Google Play SDK for Android
- Android SDK 3.2 or higher (to compile with AdMob)
- Android runtime 2.1 or higher (Cordova only supports 2.1+)
- AdMob publisher ID from [AdMob](www.admob.com)

##Setup:

1. It's recommended to use cordova command line tool to manage the plugin like this:
   cordova plugin add https://github.com/floatinghotpot/cordova-plugin-admob.git
2. Place Cordova SDK jar inside libs/
3. Complete the Google Play SDK setup for Android at
   https://developer.android.com/google/play-services/setup.html

If hope to setup manually, then:

1. Place Cordova SDK jar, and the AdMob Cordova plugin
   jar inside libs/
2. Add Google Play SDK:
      * Copy the library project at ```<android-sdk>/extras/google/google_play_services/libproject/google-play-services_lib/``` to the location where you maintain your Android app projects. 
      * add ```android.library.reference.2=./google-play-services_lib``` to project.properties.
      * enter the google-play-services_lib directory, run ```android update lib-project -p . --target android-19```
3. Place Cordova JS and AdMob.js inside assets/www/
4. Place cordova.xml and plugins.xml into res/xml
5. Add `<plugin name='AdMob' value='com.google.cordova.plugin.admob'/>`
   to your `plugins.xml`

A simplified method (tested on Cordova 3.4.0 and 3.0)

1. Install the Google Play Services plugin:
```cordova plugin add https://github.com/MobileChromeApps/google-play-services.git```
2. Install _this_ plugin:
```cordova plugin add https://github.com/floatinghotpot/cordova-plugin-admob.git```

If encounter problems, please upgrade your Google SDKs to most recent version.

##Using the Plugin:

There are 3 calls needed to get AdMob Ads:

1. `createBannerView`

   Takes in a object containing a publisherId and adSize, as well as success
   and failure callbacks.  An example call is provided below:

        window.plugins.AdMob.createBannerView(
             {
               'publisherId': 'INSERT_YOUR_PUBLISHER_ID_HERE',
               'adSize': window.plugins.AdMob.AD_SIZE.BANNER
             },
             successCallback,
             failureCallback
         );

2. `requestAd`

   Takes in an object containing an optional testing flag, and an optional
   list of extras.  This method should only be invoked once createBannerView
   has invoked successCallback.  An example call is provided below:

         window.plugins.AdMob.requestAd(
             {
               'isTesting': false,
               'extras': {
                 'color_bg': 'AAAAFF',
                 'color_bg_top': 'FFFFFF',
                 'color_border': 'FFFFFF',
                 'color_link': '000080',
                 'color_text': '808080',
                 'color_url': '008000'
               },
             },
             successCallback,
             failureCallback
         );


3. `showAd`

   Show or hide the Ad.
   
   This method should only be invoked once createBannerView has invoked successCallback.  
   An example call is provided below:

         window.plugins.AdMob.showAd( 
             true,
             successCallback,
             failureCallback
         );

This plugin also allows you the option to listen for ad events.  The following
events are supported:

    document.addEventListener('onReceiveAd', callback);
    document.addEventListener('onFailedToReceiveAd', callback);
    document.addEventListener('onPresentAd', callback);
    document.addEventListener('onDismissAd', callback);
    document.addEventListener('onLeaveToAd', callback); 
