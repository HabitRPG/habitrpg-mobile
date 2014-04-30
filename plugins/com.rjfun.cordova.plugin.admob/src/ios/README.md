AdMob Cordova Plugin for iOS
================================

This is the AdMob Cordova Plugin for iOS.  It provides a way to request
AdMob ads natively from JavaScript.  This plugin was written and tested with
the Google AdMob SDK version 6.4.0 for iOS, and Cordova 2.5.0.
Now, it's port to Cordova 3.0.0, and tested pass.

##Requirements:

- Cordova SDK for iOS
- Cordova JS for iOS
- Google AdMob Ads SDK for iOS
- iOS version 3.2 or later as well as XCode 4.2 or later
- AdMob publisher ID from [AdMob](www.admob.com)

##Setup:

1. It's recommended to use cordova command line tool to manage the plugin like this:
   cordova plugin add https://github.com/floatinghotpot/cordova-plugin-admob.git
   
2. Import Cordova SDK binary and Google AdMob SDK binary into your project (with
   their associated header files).
   
3. Complete the Google AdMob SDK setup for iOS at
   https://developers.google.com/mobile-ads-sdk/docs.

If hope to setup manually instead of using cordova command line tool, then:
   
1. Place AdMob.js inside www/ folder. The path is:
   platforms/ios/www/plugins/org.apache.cordova.plugin.admob/www/.
   
2. Place CDVAdMob.h and CDVAdMob.m into the plugins folder, the path is:
   Plugins/org.apache.cordova.plugin.admob/.
   
3. Add following content into config.xml:
    <feature name="AdMob">
        <param name="ios-package" value="CDVAdMob" />
    </feature>
    
4. Add following required frameworks, targets -> buildl phases -> link binary with ...
 	     StoreKit.framework
 	     AudioToolbox.framework
         MessageUI.framework
         SystemConfiguration.framework
         CoreGraphics.framework
         AdSupport.framework
         
5. To make sure there are no domain whitelisting issues, make sure you've set
   the origin attribute of the \<access\> element to "*".

##Implementation:

##Using the Plugin:

There are 3 calls needed to get AdMob Ads:

1. `createBannerView`

   Takes in a object containing a publisherId and adSize, as well as success
   and failure callbacks.  An example call is provided below:

        window.AdMob.createBannerView(
             {
               'publisherId': 'INSERT_YOUR_PUBLISHER_ID_HERE',
               'adSize': AdSize.BANNER
             },
             successCallback,
             failureCallback
         );

2. `requestAd`

   Takes in an object containing an optional testing flag, and an optional
   list of extras.  This method should only be invoked once createBannerView
   has invoked successCallback.  An example call is provided below:

         window.AdMob.requestAd(
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

         window.AdMob.showAd( 
             true, // or false
             successCallback,
             failureCallback
         );

This plugin also allows you the option to listen for ad events.  The following
events are supported:

    document.addEventListener('onReceiveAd', callback);
    document.addEventListener('onFailedToReceiveAd', callback);
    document.addEventListener('onPresentScreen', callback);
    document.addEventListener('onDismissScreen', callback);
    document.addEventListener('onLeaveApplication', callback);
