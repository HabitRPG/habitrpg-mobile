In app billing documentation
===================================

In-app Billing Version 2 is superseded. Please [migrate to Version 3](http://developer.android.com/google/play/billing/billing_overview.html#migration) at your earliest convenience.

Requirements
-------------
Tested on Cordova 2.3 and In App Billing v2
Android 2.2 and Google Play store app 3.5 are required

Installation 
-------------
* Get acquainted with the Android In-app Billing documentation.
* Add in your src folder the *com* folder  
It contains:
    * [Google Play In-app Billing library]( http://developer.android.com/guide/google/play/billing/billing_overview.html)
	* Cordova InAppBillingPlugin
* Add in your src folder the *net* folder  
It contains the [Android Billing Library](https://github.com/robotmedia/AndroidBillingLibrary)
* Add inappbilling.js in your www folder 
* Add in your index.html
`<script type="text/javascript" charset="utf-8" src="inappbilling.js"></script>`
* In res/xml/config.xml, add     
`<plugin name="InAppBillingPlugin" value="com.smartmobilesoftware.inappbilling.InAppBillingPlugin"/>`
* Open the AndroidManifest.xml of your application
	* add this permission  
`<uses-permission android:name="com.android.vending.BILLING" />`
	* this service and receiver inside the application element:  
<pre>
&lt;service android:name="net.robotmedia.billing.BillingService" /&gt;
&lt;receiver android:name="net.robotmedia.billing.BillingReceiver"&gt;
	&lt;intent-filter&gt;
		&lt;action android:name="com.android.vending.billing.IN_APP_NOTIFY" /&gt;
		&lt;action android:name="com.android.vending.billing.RESPONSE_CODE" /&gt;
		&lt;action android:name="com.android.vending.billing.PURCHASE_STATE_CHANGED" /&gt;
	&lt;/intent-filter&gt;
&lt;/receiver&gt;
</pre>
* Create a release apk of your app and sign it. 
* Create a new application via the "Old Design" of the Developer Console. You will be asked about switching to the new design for getting public key. DON'T do it. Perform all next actions from Old Design.
* Upload your apk from the Old Design
* Enter the app description, logo, etc. then click on save
* Add in-app purchases items from the Developer Console (publish them but do not publish the app)
* Wait 6-8 hours
* Switch to the New Design to get your application security key
* In com.smartmobilesoftware.inappbilling open InAppBillingPlugin.java
	* Add you security key (public key)
	* Modify the salt with random numbers
* Install the signed app on your test device in release mode. The Google Account on the test device should not be the same as the developer account).
* Read carefully the Google testing guide to learn how to test your app : http://developer.android.com/guide/google/play/billing/billing_testing.html

Usage
-------
#### Initialization
Initialize the billing plugin.

    inappbilling.init(success,error)
parameters
* success : The success callback.
* error : The error callback.

#### Restore previous purchases
A call will kindly ask Google Play the list of all the previous purchases. It can take a few seconds before the list of purchases gets updated in the local database. A success callback will be triggered after the request of the list to Google Play (which does not mean that Google Play has replied yet). You should call this function only when your application is reinstalled, installed for the first time on a device or every month for subscriptions.

    inappbilling.restoreTransactions(success,error)
parameters
* success : The success callback.
* error : The error callback.

#### Purchase
    inappbilling.purchase(success, fail,productId)
parameters
* success : The success callback.
* error : The error callback.
* productId : The in app billing porduct id (example "sword_001")


#### Retrieve owned products
The lists of owned products are retrieved from the local database.

	inappbilling.getOwnItems(success, fail)
parameters
* success : The success callback. It provides a json array of the list of owned products as a parameter. Example :  
[  
	{  
		"purchaseToken":"tfmlpuimqrzyzfxnhvwxdbpo",  
		"orderId":"12999763169054705758.1378834833015554",  
		"productId":"sword_001"  
	},  
	{  
		"purchaseToken":"zofijzoejfouaieuaiounjsd",  
		"orderId":"45862930169054705776.8293052801485002",  
		"productId":"saber_001"  
	}  
]    

* error : The error callback.

#### Check if the in-app subscription is supported
Android 2.2 and Google Play store app 3.5 are required

	inappbilling.checkSubscriptionSupported(success, fail)
parameters
* success : The success callback. 
* error : The error callback.

#### Purchase a subscription
    inappbilling.subscribe(success, fail, subcriptionId)
parameters
* success : The success callback.
* error : The error callback.
* productId : The in app billing porduct id (example "premium_001")

	
Quick example
---------------
```javascript
inappbilling.init(successInit,errorCallback)

function successInit(result) {    
	// display the extracted text   
	alert(result); 
	inappbilling.purchase(successPurchase,errorCallback, "sword_001");
	
}    
function errorCallback(error) {
   alert(error); 
} 

function successPurchase(productId) {
   alert("Your item has been purchased!");
} 
```

Full example
----------------
```html
<!DOCTYPE HTML>
<html>
	<head>
		<title>In App Billing</title>
		<script type="text/javascript" charset="utf-8" src="cordova-2.3.0.js"></script>
		<script type="text/javascript" charset="utf-8" src="inappbilling.js"></script>
		<script type="text/javascript" charset="utf-8">
			function successHandler (result) {
                var strResult = "";
                if(typeof result === 'object') {
                    strResult = JSON.stringify(result);
                } else {
                    strResult = result;
                }
                alert("SUCCESS: \r\n"+strResult );
            }
			
			function errorHandler (error) {
			    alert("ERROR: \r\n"+error );
			}

            // Click on init button
			function init(){
				// Initialize the billing plugin
				inappbilling.init(successHandler, errorHandler); 
			}

            // Restore the transactions
            function restoreTransactions(){
                // make the purchase
                inappbilling.restoreTransactions(successHandler, errorHandler);

            }
			
			// Click on purchase button
			function purchase(){
				// make the purchase
				inappbilling.purchase(successHandler, errorHandler,"sword_002"); 
				
			}
			
			// Click on ownedProducts button
			function ownedProducts(){
				// Initialize the billing plugin
				inappbilling.getOwnItems(successHandler, errorHandler); 
				
			}

            // Check checkSubscriptionSupported button
            function checkSubscriptionSupported(){
                // Initialize the billing plugin
                inappbilling.checkSubscriptionSupported(successHandler, errorHandler);

            }
            // Click on subscribe button
            function subscribe(){
                // make the purchase
                inappbilling.subscribe(successHandler, errorHandler,"premium_002");

            }

        </script>
		
	</head>
	<body>
		<h1>Hello World</h1>
		<button onclick="init();">Initalize the billing plugin</button>
        <button onclick="restoreTransactions();">Restore transactions</button>
		<button onclick="purchase();">Purchase</button>
        <button onclick="ownedProducts();">Owned products</button>
        <button onclick="checkSubscriptionSupported();">Check Subscription Supported</button>
        <button onclick="subscribe();">Subscribe</button>


    </body>
</html>
```

Common issues
----------------
If you have an issue, make sure that you can answer to theses questions:  
Did you create your item in the Developer Console?  
Is the id for your item the same in the Developer Console and in your app?  
Is your item published?  
Have you waited at least a few hours since you published your item?  
Are you using a different Google account than your developer account to make the purchase?  
Are you testing on a real device, rather than the emulator?  
Are you using a signed apk?  
Is the version code of your app the same as the one uploaded on the Developer Console?  
Have you created the app using the Old Design of the Developer Console?  
  
If any of these questions is answered with a "no", you probably need to fix that.  


MIT License
----------------

Copyright (c) 2012-2013 Guillaume Charhon - Smart Mobile Software

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
