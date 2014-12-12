package com.smartmobilesoftware.inappbilling;

import org.apache.cordova.api.CallbackContext;

import android.app.Activity;
import net.robotmedia.billing.helper.AbstractBillingObserver;

public abstract class CordovaAbstractBillingObserver extends AbstractBillingObserver {
	public CallbackContext callbackContext;
	
	public CordovaAbstractBillingObserver(Activity activity) {
		super(activity);
	}

}