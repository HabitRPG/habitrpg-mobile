package com.smartmobilesoftware.inappbilling;

import java.util.ArrayList;
import java.util.List;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import net.robotmedia.billing.BillingController;
import net.robotmedia.billing.BillingRequest.ResponseCode;
import net.robotmedia.billing.model.Transaction;
import net.robotmedia.billing.model.Transaction.PurchaseState;

import android.app.Activity;
import android.util.Log;

// In app billing plugin
public class InAppBillingPlugin extends CordovaPlugin {
	// Yes, that's the two variables to edit :)
	private static final String publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMqK7VsG9Ntg3aKEnq4rMy++xJqdwcez4gBAsufxnnE0QmopYv19Ia0yl0ICBQo3KqATV5lenxQDxuSaIvgWSSZXbW4eS6tQF+9kAdUBdR4R1ioBhDcaHoqsqndcSDQ7TvEzIaqw0ZTbOcmEDYPE8YPs9cPJCRU7lUIwkGoOvSYpZi6AJ02aYKnKHRAujNF1P+BGSpRJ6A6Psn0UoTqIzkG7NOxYFttjXZEK+SGeMEF3XnRkH/7rksZDpo2DK0ruzRq8EGCZt13CXihzeJYGjd0qSyhgIuCarlNeetwSK3nq63wj7+pbQRZDQFoOLRUW/2qGNVlg6lsiL4LiKnFTGwIDAQAB";
	private static final byte[] salt = { 41, -90, -116, -41, 66, -53, 122,
			-110, -127, -96, -88, 77, 127, 115, 1, 73, 57, 110, 48, -116 };

	private static final String INIT_STRING = "init";
	private static final String PURCHASE_STRING = "purchase";
	private static final String OWN_ITEMS_STRING = "ownItems";
	private static final String SUBSCRIBE_STRING = "subscribe";
	private static final String CHECK_SUBSCRIPTION_SUPPORTED_STRING = "checkSubscriptionSupported";
	private static final String RESTORE_TRANSACTIONS_STRING = "restoreTransactions";

	private final String TAG = "CORDOVA_BILLING";
	// Observer notified of events
	private CordovaAbstractBillingObserver mBillingObserver;
	private Activity activity;
	// private String callbackId;

	// Plugin action handler
	@Override
	public boolean execute(String action, JSONArray data,  CallbackContext callbackContext) {
		// Save the callback id
		// this.callbackId = callbackId;
		boolean result = true;
		PluginResult pluginResult;
		
		
		if (INIT_STRING.equals(action)) {
			// Initialize the plugin
			initialize(callbackContext);
			// Wait for the restore transaction and billing supported test
			pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
			pluginResult.setKeepCallback(true);
			callbackContext.sendPluginResult(pluginResult);
	
			result = true;
		} else if (RESTORE_TRANSACTIONS_STRING.equals(action)) {
			// Try to restore the transactions
			restoreTransactions();
			callbackContext.success("Restore request sent to Google Play");
			
			result = true;

			

		} else if (PURCHASE_STRING.equals(action)) {
			// purchase the item
			
			// Set the callback context on the observer
			mBillingObserver.callbackContext = callbackContext;
			
			try {
				// Retrieve parameters
				String productId = data.getString(0);
				
				// Make the purchase
				BillingController.requestPurchase(cordova.getActivity(), productId, true /* confirm */, null);
				
				// Go back to the javascript but wait for the reply
				pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
				pluginResult.setKeepCallback(true);
				callbackContext.sendPluginResult(pluginResult);
				
				result = true;
			} catch (Exception ex) {
				callbackContext.error("Invalid parameter");
				result = false;
			}

			

		} else if (OWN_ITEMS_STRING.equals(action)){
			
			try {
				
				JSONObject aJsonTransaction;
				// Json that will store the response to send to the javascript
		        JSONArray jsonResponse = new JSONArray();
		        // Retrieve the bought items
				ArrayList<Transaction> ownItems = new ArrayList<Transaction>();
				ownItems = getOwnedItems();
				
				// Convert the array of Transactions to a JsonArray
				for (Transaction item : ownItems){
					aJsonTransaction = new JSONObject();
					aJsonTransaction.put("orderId", item.orderId);
					aJsonTransaction.put("productId", item.productId);
					aJsonTransaction.put("purchaseToken", item.purchaseToken);
					jsonResponse.put(aJsonTransaction);
				}
				
				pluginResult = new PluginResult(PluginResult.Status.OK, jsonResponse);
				callbackContext.sendPluginResult(pluginResult);
				
				result = true;
			} catch (JSONException e) {
				callbackContext.error("Json parsing error : " + e.getMessage());
				result = false;
			}
			
		} else if (CHECK_SUBSCRIPTION_SUPPORTED_STRING.equals(action)){
			// Check if the subscription is supported
			
			// Set the callback context on the observer
			mBillingObserver.callbackContext = callbackContext;
			
			BillingController.checkSubscriptionSupported(cordova.getActivity());
			
			pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
			pluginResult.setKeepCallback(true);
			callbackContext.sendPluginResult(pluginResult);

			result = true;
	
		} else if (SUBSCRIBE_STRING.equals(action)) {
			// Set the callback context on the observer
			mBillingObserver.callbackContext = callbackContext;
			
			// purchase the subscription
			try {

				// Retrieve parameters
				String productId = data.getString(0);
				// Make the purchase
				BillingController.requestSubscription(cordova.getActivity(), productId, true /* confirm */, null);
				
				pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
				pluginResult.setKeepCallback(true);
				callbackContext.sendPluginResult(pluginResult);
				
				result = true;
			} catch (Exception ex) {
				callbackContext.error("Invalid parameter");
				result = false;
			}	
		} else {
			result = false;
		}

		
		return result;
	}

	// Initialize the plugin
	private void initialize(CallbackContext callbackContext) {
		BillingController.setDebug(true);
		// configure the in app billing
		BillingController
				.setConfiguration(new BillingController.IConfiguration() {

					public byte[] getObfuscationSalt() {
						return InAppBillingPlugin.salt;
					}

					public String getPublicKey() {
						return InAppBillingPlugin.publicKey;
					}
				});

		// Get the activity from the Plugin
		// Activity test = this.cordova.getActivity().
		
		activity = cordova.getActivity();

		// Create a BillingObserver in charge to be notified of the actions of the BillingController
		mBillingObserver = new CordovaAbstractBillingObserver(activity) {

			public void onBillingChecked(boolean supported) {
				InAppBillingPlugin.this.onBillingChecked(supported, this.callbackContext);
			}

			public void onPurchaseStateChanged(String itemId,
					PurchaseState state) {
				InAppBillingPlugin.this.onPurchaseStateChanged(itemId, state, this.callbackContext);
			}

			public void onRequestPurchaseResponse(String itemId,
					ResponseCode response) {
				InAppBillingPlugin.this.onRequestPurchaseResponse(itemId,
						response, this.callbackContext);
			}

			public void onSubscriptionChecked(boolean supported) {
				InAppBillingPlugin.this.onSubscriptionChecked(supported, this.callbackContext);
			}

		};
		
		// The callback context should be updated each time cordova is called
		mBillingObserver.callbackContext = callbackContext;

		// register observer
		BillingController.registerObserver(mBillingObserver);
		PluginResult result;
		result = new PluginResult(PluginResult.Status.OK, "In app billing initialized");
		result.setKeepCallback(false);
		callbackContext.sendPluginResult(result);
		


	}

	public void onBillingChecked(boolean supported, CallbackContext callbackContext) {
		PluginResult result;
		if (supported) {
			Log.d("BILLING", "In app billing supported");
			// restores previous transactions, if any.
			restoreTransactions();
			result = new PluginResult(PluginResult.Status.OK, "In app billing supported");
			// stop waiting for the callback
			result.setKeepCallback(false);
			// notify the app
			callbackContext.sendPluginResult(result);
		} else {
			Log.d("BILLING", "In app billing not supported");
			result = new PluginResult(PluginResult.Status.ERROR,
					"In app billing not supported");
			// stop waiting for the callback
			result.setKeepCallback(false);
			// notify the app
			callbackContext.sendPluginResult(result);
		}

	}

	// change in the purchase
	public void onPurchaseStateChanged(String itemId, PurchaseState state, CallbackContext callbackContext) {
		PluginResult result;

		Log.i(TAG, "onPurchaseStateChanged() itemId: " + itemId);
		
		// Check the status of the purchase
		if(state == PurchaseState.PURCHASED){
			// Item has been purchased :)
			result = new PluginResult(PluginResult.Status.OK, itemId);
			result.setKeepCallback(false);
			callbackContext.sendPluginResult(result);
			
		} else {
			// purchase issue
			String message = "";
			if (state == PurchaseState.CANCELLED){
				message = "canceled";
			} else if (state == PurchaseState.REFUNDED){
				message = "refunded";
			} else if (state == PurchaseState.EXPIRED){
				message = "expired";
			} 
			// send the result to the app
			result = new PluginResult(PluginResult.Status.ERROR, message);
			result.setKeepCallback(false);
			callbackContext.sendPluginResult(result);

		}

		
	}

	// response from the billing server
	public void onRequestPurchaseResponse(String itemId, ResponseCode response, CallbackContext callbackContext) {
		PluginResult result;

		// check the response
		Log.d(TAG, "response code ");
		
		if(response == ResponseCode.RESULT_OK){
			// purchase succeeded
			result = new PluginResult(PluginResult.Status.OK, itemId);
			result.setKeepCallback(false);
			callbackContext.sendPluginResult(result);
		} else {
			// purchase error
			String message = "";

			// get the error message
			if (response == ResponseCode.RESULT_USER_CANCELED){
				message = "canceled";
			
			} else if (response == ResponseCode.RESULT_SERVICE_UNAVAILABLE){
				message = "network connection error";
			} else if (response == ResponseCode.RESULT_BILLING_UNAVAILABLE){
				message = "in app billing unavailable";
			} else if (response == ResponseCode.RESULT_ITEM_UNAVAILABLE){
				message = "cannot find the item";
			} else if (response == ResponseCode.RESULT_DEVELOPER_ERROR){
				message = "developer error";
			} else if (response == ResponseCode.RESULT_ERROR){
				message = "unexpected server error";
			} 
			// send the result to the app
			result = new PluginResult(PluginResult.Status.ERROR, message);
			result.setKeepCallback(false);
			callbackContext.sendPluginResult(result);
		}

	}

	public void onSubscriptionChecked(boolean supported, CallbackContext callbackContext) {
		PluginResult result;
		if (supported) {
			Log.d("BILLING", "Subscription supported");
			
			result = new PluginResult(PluginResult.Status.OK, "Subscription supported");
			// stop waiting for the callback
			result.setKeepCallback(false);
			// notify the app
			callbackContext.sendPluginResult(result);
		} else {
			Log.d("BILLING", "Subscription not supported");
			result = new PluginResult(PluginResult.Status.ERROR,
					"Subscription not supported");
			// stop waiting for the callback
			result.setKeepCallback(false);
			// notify the app
			callbackContext.sendPluginResult(result);
		}
		
	}

	/**
	 * Restores previous transactions, if any. This happens if the application
	 * has just been installed or the user wiped data. We do not want to do this
	 * on every startup, rather, we want to do only when the database needs to
	 * be initialized.
	 */
	private void restoreTransactions() {
		if (!mBillingObserver.isTransactionsRestored()) {
			BillingController.restoreTransactions(cordova.getActivity());			
		}
	}

	// update bought items 
	private ArrayList<Transaction> getOwnedItems() {
		List<Transaction> transactions = BillingController
				.getTransactions(cordova.getActivity());
		final ArrayList<Transaction> ownedItems = new ArrayList<Transaction>();
		for (Transaction t : transactions) {
			// Add only transactions (products and subscriptions) that are active
			if (t.purchaseState == PurchaseState.PURCHASED) {
				ownedItems.add(t);
			}
		}
		// The list of purchased items is now stored in "ownedItems"

		return ownedItems;

	}

}
