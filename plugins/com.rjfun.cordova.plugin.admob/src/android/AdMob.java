package com.rjfun.cordova.plugin;

import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.InterstitialAd;
import com.google.android.gms.ads.mediation.admob.AdMobExtras;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.LinearLayoutSoftKeyboardDetect;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.view.View;
import android.os.Bundle;

import java.util.Iterator;

/**
 * This class represents the native implementation for the AdMob Cordova plugin.
 * This plugin can be used to request AdMob ads natively via the Google AdMob SDK.
 * The Google AdMob SDK is a dependency for this plugin.
 */
public class AdMob extends CordovaPlugin {
  /** The adView to display to the user. */
  private AdView adView;

  /** The interstitial ad to display to the user. */
  private InterstitialAd interstitialAd;

  /** Whether or not the ad should be positioned at top or bottom of screen. */
  private boolean bannerAtTop;

  /** Common tag used for logging statements. */
  private static final String LOGTAG = "AdMob";

  /** Cordova Actions. */
  private static final String ACTION_CREATE_BANNER_VIEW = "createBannerView";
  private static final String ACTION_CREATE_INTERSTITIAL_VIEW = "createInterstitialView";
  private static final String ACTION_DESTROY_BANNER_VIEW = "destroyBannerView";
  private static final String ACTION_REQUEST_AD = "requestAd";
  private static final String ACTION_REQUEST_INTERSTITIAL_AD = "requestInterstitialAd";
  private static final String ACTION_SHOW_AD = "showAd";

  private static final int	PUBLISHER_ID_ARG_INDEX = 0;
  private static final int	AD_SIZE_ARG_INDEX = 1;
  private static final int	POSITION_AT_TOP_ARG_INDEX = 2;

  private static final int	IS_TESTING_ARG_INDEX = 0;
  private static final int	EXTRAS_ARG_INDEX = 1;

  private static final int	SHOW_AD_ARG_INDEX = 0;

  /**
   * This is the main method for the AdMob plugin.  All API calls go through here.
   * This method determines the action, and executes the appropriate call.
   *
   * @param action The action that the plugin should execute.
   * @param inputs The input parameters for the action.
   * @param callbackContext The callback context.
   * @return A PluginResult representing the result of the provided action.  A
   *         status of INVALID_ACTION is returned if the action is not recognized.
   */
  @Override
  public boolean execute(String action, JSONArray inputs, CallbackContext callbackContext) throws JSONException {
    PluginResult result;
    if (ACTION_CREATE_BANNER_VIEW.equals(action)) {
      result = executeCreateBannerView(inputs);
    } else if (ACTION_CREATE_INTERSTITIAL_VIEW.equals(action)) {
      result = executeCreateInterstitialView(inputs);
    } else if (ACTION_DESTROY_BANNER_VIEW.equals(action)) {
      result = executeDestroyBannerView();
    } else if (ACTION_REQUEST_INTERSTITIAL_AD.equals(action)) {
      result = executeRequestInterstitialAd(inputs);
    } else if (ACTION_REQUEST_AD.equals(action)) {
      result = executeRequestAd(inputs);
    } else if (ACTION_SHOW_AD.equals(action)) {
      result = executeShowAd(inputs);
    } else {
      Log.d(LOGTAG, String.format("Invalid action passed: %s", action));
      result = new PluginResult(Status.INVALID_ACTION);
    }
    callbackContext.sendPluginResult( result );

    return true;
  }

  /**
   * Parses the create banner view input parameters and runs the create banner
   * view action on the UI thread.  If this request is successful, the developer
   * should make the requestAd call to request an ad for the banner.
   *
   * @param inputs The JSONArray representing input parameters.  This function
   *        expects the first object in the array to be a JSONObject with the
   *        input parameters.
   * @return A PluginResult representing whether or not the banner was created
   *         successfully.
   */
  private PluginResult executeCreateBannerView(JSONArray inputs) {
    String publisherId;
    String size;

    // Get the input data.
    try {
      publisherId = inputs.getString( PUBLISHER_ID_ARG_INDEX );
      size = inputs.getString( AD_SIZE_ARG_INDEX );
      this.bannerAtTop = inputs.getBoolean( POSITION_AT_TOP_ARG_INDEX );

    } catch (JSONException exception) {
      Log.w(LOGTAG, String.format("Got JSON Exception: %s", exception.getMessage()));
      return new PluginResult(Status.JSON_EXCEPTION);
    }

    // Create the AdView on the UI thread.
    return executeRunnable(new CreateBannerViewRunnable(
        publisherId, adSizeFromSize(size)));
  }

  /**
   * Parses the create interstitial view input parameters and runs the create interstitial
   * view action on the UI thread.  If this request is successful, the developer
   * should make the requestAd call to request an ad for the banner.
   *
   * @param inputs The JSONArray representing input parameters.  This function
   *        expects the first object in the array to be a JSONObject with the
   *        input parameters.
   * @return A PluginResult representing whether or not the banner was created
   *         successfully.
   */
  private PluginResult executeCreateInterstitialView(JSONArray inputs) {
    String publisherId;

    // Get the input data.
    try {
      publisherId = inputs.getString( PUBLISHER_ID_ARG_INDEX );
    } catch (JSONException exception) {
      Log.w(LOGTAG, String.format("Got JSON Exception: %s", exception.getMessage()));
      return new PluginResult(Status.JSON_EXCEPTION);
    }

    // Create the Interstitial View on the UI thread.
    return executeRunnable(new CreateInterstitialViewRunnable(publisherId));
  }

  private PluginResult executeDestroyBannerView() {
    // Destroy the AdView on the UI thread.
    return executeRunnable(new DestroyBannerViewRunnable());
  }

  /**
   * Parses the request ad input parameters and runs the request ad action on
   * the UI thread.
   *
   * @param inputs The JSONArray representing input parameters.  This function
   *        expects the first object in the array to be a JSONObject with the
   *        input parameters.
   * @return A PluginResult representing whether or not an ad was requested
   *         succcessfully.  Listen for onReceiveAd() and onFailedToReceiveAd()
   *         callbacks to see if an ad was successfully retrieved. 
   */
  private PluginResult executeRequestAd(JSONArray inputs) {
    boolean isTesting;
    JSONObject inputExtras;

    // Get the input data.
    try {
      isTesting = inputs.getBoolean( IS_TESTING_ARG_INDEX );
      inputExtras = inputs.getJSONObject( EXTRAS_ARG_INDEX );

    } catch (JSONException exception) {
      Log.w(LOGTAG, String.format("Got JSON Exception: %s", exception.getMessage()));
      return new PluginResult(Status.JSON_EXCEPTION);
    }

    // Request an ad on the UI thread.
    return executeRunnable(new RequestAdRunnable(isTesting, inputExtras));
  }

  /**
   * Parses the request interstitial ad input parameters and runs the request ad action on
   * the UI thread.
   *
   * @param inputs The JSONArray representing input parameters.  This function
   *        expects the first object in the array to be a JSONObject with the
   *        input parameters.
   * @return A PluginResult representing whether or not an ad was requested
   *         succcessfully.  Listen for onReceiveAd() and onFailedToReceiveAd()
   *         callbacks to see if an ad was successfully retrieved. 
   */
  private PluginResult executeRequestInterstitialAd(JSONArray inputs) {
    boolean isTesting;
    JSONObject inputExtras;

    // Get the input data.
    try {
      isTesting = inputs.getBoolean( IS_TESTING_ARG_INDEX );
      inputExtras = inputs.getJSONObject( EXTRAS_ARG_INDEX );

    } catch (JSONException exception) {
      Log.w(LOGTAG, String.format("Got JSON Exception: %s", exception.getMessage()));
      return new PluginResult(Status.JSON_EXCEPTION);
    }

    // Request an ad on the UI thread.
    return executeRunnable(new RequestInterstitialAdRunnable(isTesting, inputExtras));
  }

  /**
   * Parses the show ad input parameters and runs the show ad action on
   * the UI thread.
   *
   * @param inputs The JSONArray representing input parameters.  This function
   *        expects the first object in the array to be a JSONObject with the
   *        input parameters.
   * @return A PluginResult representing whether or not an ad was requested
   *         succcessfully.  Listen for onReceiveAd() and onFailedToReceiveAd()
   *         callbacks to see if an ad was successfully retrieved. 
   */
  private PluginResult executeShowAd(JSONArray inputs) {
    boolean show;

    // Get the input data.
    try {
      show = inputs.getBoolean( SHOW_AD_ARG_INDEX );
    } catch (JSONException exception) {
      Log.w(LOGTAG, String.format("Got JSON Exception: %s", exception.getMessage()));
      return new PluginResult(Status.JSON_EXCEPTION);
    }

    // Request an ad on the UI thread.
    return executeRunnable( new ShowAdRunnable(show) );
  }

  /**
   * Executes the runnable on the activity from the plugin's context.  This
   * is a blocking call that waits for a notification from the runnable
   * before it continues.
   *
   * @param runnable The AdMobRunnable representing the command to run.
   * @return A PluginResult representing the result of the command.
   */
  private PluginResult executeRunnable(AdMobRunnable runnable) {
    synchronized (runnable) {
      cordova.getActivity().runOnUiThread(runnable);
      try {
        if (runnable.getPluginResult() == null) {
          runnable.wait();
        }
      } catch (InterruptedException exception) {
        Log.w(LOGTAG, String.format("Interrupted Exception: %s", exception.getMessage()));
        return new PluginResult(Status.ERROR, "Interruption occurred when running on UI thread");
      }
    }
    return runnable.getPluginResult();
  }

  /**
   * Represents a runnable for the AdMob plugin that will run on the UI thread.
   */
  private abstract class AdMobRunnable implements Runnable {
    protected PluginResult result = null;

    public PluginResult getPluginResult() {
      return result;
    }
  }

  /** Runnable for the createBannerView action. */
  private class CreateBannerViewRunnable extends AdMobRunnable {
    private String publisherId;
    private AdSize adSize;

    public CreateBannerViewRunnable(String publisherId, AdSize adSize) {
      this.publisherId = publisherId;
      this.adSize = adSize;
    }

    @Override
    public void run() {
      if (adSize == null) {
        result = new PluginResult(Status.ERROR, "AdSize is null. Did you use an AdSize constant?");
      } else {
        adView = new AdView(cordova.getActivity());
        adView.setAdUnitId(publisherId);
        adView.setAdSize(adSize);
        adView.setAdListener(new BannerListener());
        LinearLayoutSoftKeyboardDetect parentView =
            (LinearLayoutSoftKeyboardDetect) webView.getParent();
        if (bannerAtTop) {
          parentView.addView(adView, 0);
        } else {
          parentView.addView(adView);
        }
        // Notify the plugin.
        result = new PluginResult(Status.OK);
      }
      synchronized (this) {
        this.notify();
      }
    }
  }

  /** Runnable for the createInterstitialView action. */
  private class CreateInterstitialViewRunnable extends AdMobRunnable {
    private String publisherId;

    public CreateInterstitialViewRunnable(String publisherId) {
      this.publisherId = publisherId;
      result = new PluginResult(Status.NO_RESULT);
    }

    @Override
    public void run() {
      // Create the interstitial Ad.
      interstitialAd = new InterstitialAd(cordova.getActivity());
      interstitialAd.setAdUnitId(publisherId);
      interstitialAd.setAdListener(new InterstitialListener());
      result = new PluginResult(Status.OK);

      synchronized (this) {
        this.notify();
      }
    }
  }

  private class DestroyBannerViewRunnable extends AdMobRunnable {
    public DestroyBannerViewRunnable() {
      result = new PluginResult(Status.NO_RESULT);
    }

    @Override
    public void run() {
      if(adView != null) {
        LinearLayoutSoftKeyboardDetect parentView =
            (LinearLayoutSoftKeyboardDetect) webView.getParent();
        parentView.removeView(adView);
      }
      // Notify the plugin.
      result = new PluginResult(Status.OK);
      synchronized (this) {
        this.notify();
      }
    }
  }

  /** Runnable for the basic requestAd action. */
  private class RequestAdBasicRunnable extends AdMobRunnable {
    private boolean isTesting;
    private JSONObject inputExtras;
    private String adType;

    @SuppressWarnings("unchecked")
    @Override
    public void run() {
      if (adType.isEmpty()) {
        result = new PluginResult(Status.ERROR, "AdView/InterstitialAd is null.  Did you call createBannerView/createInterstitialView?");
      } else {
        AdRequest.Builder request_builder = new AdRequest.Builder();
        if (isTesting) {
          // This will request test ads on the emulator only.  You can get your
          // hashed device ID from LogCat when making a live request.  Pass
          // this hashed device ID to addTestDevice request test ads on your
          // device.
          request_builder = request_builder.addTestDevice(AdRequest.DEVICE_ID_EMULATOR);
        }
        Bundle bundle = new Bundle();
        Iterator<String> extrasIterator = inputExtras.keys();
        boolean inputValid = true;
        while (extrasIterator.hasNext()) {
          String key = extrasIterator.next();
          try {
            bundle.putString(key, inputExtras.get(key).toString());
          } catch (JSONException exception) {
            Log.w(LOGTAG, String.format("Caught JSON Exception: %s", exception.getMessage()));
            result = new PluginResult(Status.JSON_EXCEPTION, "Error grabbing extras");
            inputValid = false;
          }
        }
        if (inputValid) {
          bundle.putInt("cordova", 1);
          AdMobExtras extras = new AdMobExtras(bundle);
          request_builder = request_builder.addNetworkExtras(extras);
          AdRequest request = request_builder.build();
          if (adView != null && adType.equals("banner"))
            adView.loadAd(request);
          else if (interstitialAd != null && adType.equals("interstitial"))
            interstitialAd.loadAd(request);
          result = new PluginResult(Status.OK);
        }
      }
      synchronized (this) {
        this.notify();
      }
    }
  }

  /** Runnable for the requestAd action for Banner. */
  private class RequestAdRunnable extends RequestAdBasicRunnable {
    public RequestAdRunnable(boolean isTesting, JSONObject inputExtras) {
      super.isTesting = isTesting;
      super.inputExtras = inputExtras;
      super.adType = "banner";
    }
  }

  /** Runnable for the requestAd action for Interstitial. */
  private class RequestInterstitialAdRunnable extends RequestAdBasicRunnable {
    public RequestInterstitialAdRunnable(boolean isTesting, JSONObject inputExtras) {
      super.isTesting = isTesting;
      super.inputExtras = inputExtras;
      super.adType = "interstitial";
      result = new PluginResult(Status.NO_RESULT);
    }
  }

  /** Runnable for the showAd action. This is only available for Banner View. */
  private class ShowAdRunnable extends AdMobRunnable {
    private boolean show;

    public ShowAdRunnable(boolean show) {
      this.show = show;
    }

    @SuppressWarnings("unchecked")
    @Override
    public void run() {
      if (adView == null) {
        result = new PluginResult(Status.ERROR, "AdView is null.  Did you call createBannerView?");
      } else {
        result = new PluginResult(Status.OK);
        if (this.show) {
          adView.setVisibility(View.VISIBLE);
        } else {
          adView.setVisibility(View.GONE);
        }
      }
      synchronized (this) {
        this.notify();
      }
    }
  }

  /**
   * This class implements the AdMob ad listener events.  It forwards the events
   * to the JavaScript layer.  To listen for these events, use:
   *
   * document.addEventListener('onReceiveAd', function());
   * document.addEventListener('onFailedToReceiveAd', function(data));
   * document.addEventListener('onPresentAd', function());
   * document.addEventListener('onDismissAd', function());
   * document.addEventListener('onLeaveToAd', function());
   */
  public class BasicListener extends AdListener {
    @Override
    public void onAdFailedToLoad(int errorCode) {
      webView.loadUrl(String.format(
          "javascript:cordova.fireDocumentEvent('onFailedToReceiveAd', { 'error': '%s' });",
          errorCode));
    }

    @Override
    public void onAdOpened() {
      webView.loadUrl("javascript:cordova.fireDocumentEvent('onPresentAd');");
    }

    @Override
    public void onAdClosed() {
      webView.loadUrl("javascript:cordova.fireDocumentEvent('onDismissAd');");
    }

    @Override
    public void onAdLeftApplication() {
      webView.loadUrl("javascript:cordova.fireDocumentEvent('onLeaveToAd');");
    }
  }

  private class BannerListener extends BasicListener {
    @Override
    public void onAdLoaded() {
      Log.w("AdMob", "BannerAdLoaded");
      webView.loadUrl("javascript:cordova.fireDocumentEvent('onReceiveAd');");
    }
  }

  private class InterstitialListener extends BasicListener {
    @Override
    public void onAdLoaded() {
      if (interstitialAd != null) {
        interstitialAd.show();
        Log.w("AdMob", "InterstitialAdLoaded");
      }
      webView.loadUrl("javascript:cordova.fireDocumentEvent('onReceiveAd');");
    }
  }

  @Override
  public void onPause(boolean multitasking) {
    if (adView != null) {
      adView.pause();
    }
    super.onPause(multitasking);
  }

  @Override
  public void onResume(boolean multitasking) {
    super.onResume(multitasking);
    if (adView != null) {
      adView.resume();
    }
  }

  @Override
  public void onDestroy() {
    if (adView != null) {
      adView.destroy();
    }
    super.onDestroy();
  }

  /**
   * Gets an AdSize object from the string size passed in from JavaScript.
   * Returns null if an improper string is provided.
   *
   * @param size The string size representing an ad format constant.
   * @return An AdSize object used to create a banner.
   */
  public static AdSize adSizeFromSize(String size) {
    if ("BANNER".equals(size)) {
      return AdSize.BANNER;
    } else if ("IAB_MRECT".equals(size)) {
      return AdSize.MEDIUM_RECTANGLE;
    } else if ("IAB_BANNER".equals(size)) {
      return AdSize.FULL_BANNER;
    } else if ("IAB_LEADERBOARD".equals(size)) {
      return AdSize.LEADERBOARD;
    } else if ("SMART_BANNER".equals(size)) {
      return AdSize.SMART_BANNER;
    } else {
      return null;
    }
  }
}

