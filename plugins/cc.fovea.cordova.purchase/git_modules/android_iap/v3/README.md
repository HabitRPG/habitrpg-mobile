In app billing documentation
===================================
Requirements
-------------
Phonegap 3.0, Android 2.2.1+

* Purchasing and querying managed in-app items:  
Google Play client version 3.9.16  
* Purchasing and querying subscription items:  
Google Play client version 3.10.10 or higher

Support
---------------------
For free community support, please use the issue tracker.  
To get professional non-free support for the plugin, please contact me at gcharhon(at)smartmobilesoftware.com.

If you find this plugin useful, please donate via BitCoin to support it:  
17JK27E4vbzPrJbBAtvjUVN3LrFcATtRA1

Installation
-------------

* Get acquainted with the Android [In-app Billing documentation](http://developer.android.com/google/play/billing/index.html).

### Automatic

We recommend this way to install the plugin into your project.

1. Clone this project into your repository
2. Run at the root of your project:  
```
    cordova plugin add /path/to/your/cloned/plugin/AndroidInAppBilling/v3
```  
or  
```
    phonegap local plugin add /path/to/your/cloned/plugin/AndroidInAppBilling/v3
```

### Manually

The manual steps are not working on Phonegap 3.1+. Theses steps are not maintained anymore. Check the [issue #32](_https://github.com/poiuytrez/AndroidInAppBilling/issues/32) for more info. 

* Add in your `src` folder the `src/android/com` folder  
It contains:
    * [Google Play In-app Billing library]( http://developer.android.com/guide/google/play/billing/billing_overview.html)
	* Phonegap InAppBillingPlugin
* Create a `plugins` folder in your project's `www` folder if it does not exist.
* Create a `com.smartmobilesoftware.inappbilling` folder inside the `plugins` folder.
* Copy `www/inappbilling.js` into `<path to project>/www/plugins/com.smartmobilesoftware.inappbilling/www`
* In res/xml/config.xml, add  

```xml  
<feature name="InAppBillingPlugin">   
      <param name="android-package" value="com.smartmobilesoftware.inappbilling.InAppBillingPlugin"/>  
</feature>  
```
* Open the AndroidManifest.xml of your application
	* add this permission  
`<uses-permission android:name="com.android.vending.BILLING" />`
* Create a new file named `Phonegap_plugins.js` in the `<path to project>/www` folder if it does not exist.
* Edit `Phonegap_plugins.js` and add a reference to the plugin to automatically load it:

```javascript
    Phonegap.define('Phonegap/plugin_list', function(require, exports, module) {
    module.exports = [
        {
            "file": "plugins/com.smartmobilesoftware.inappbilling/www/inappbilling.js",
            "id": "com.smartmobilesoftware.inappbilling.InAppBillingPlugin",
            "clobbers": [
                "inappbilling"
	    ]
    	}
    ]
    });
```

### Finish setting up your app
* Create a release apk of your app and sign it.
* Create a new application in the Developer Console.
* Upload your apk
* Enter the app description, logo, etc. then click on save
* Add in-app purchases items from the Developer Console (activate them but do not publish the app)
* Click on Services and APIs to get your public license key
* Create `res/values/billing_key.xml`, and add your public key as follows:

```
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="billing_key">MIIBIjANBgk...AQAB</string>
</resources>
```

* Wait 6-8 hours
* Install the signed app on your test device in release mode. The Google Account on the test device should not be the same as the developer account).
* Read carefully the Google testing guide to learn how to test your app : http://developer.android.com/guide/google/play/billing/billing_testing.html
* You can test purchase with no charge by adding google test account in your developer console -> 'Settings -> gmail accounts with testing access".
Usage
-------
#### Initialization
Initialize the billing plugin. The plugin must be inialized before calling any other methods. 

    inappbilling.init(success, error, options)
parameters
* success : The success callback.
* error : The error callback.
* options : Sets the options for the plugin
	* Available Options :
		* showLog [true,false] : showLog enables plugin JS debug messages. Default : true

#### Optional Initialization

    inappbilling.init(success, error, options, skus)
parameters
* success : The success callback.
* error : The error callback.
* options : Sets the options for the plugin
	* Available Options :
		* showLog [true,false] : showLog enables plugin JS debug messages. Default : true
* skus : string or string[] of product skus. ie. "prod1" or ["prod1","prod2]

#### Retrieve owned products
The list of owned products are retrieved from the local database.

	inappbilling.getPurchases(success, fail)
parameters
* success : The success callback. It provides an array of json object representing the owned products as a parameter. Example: 

 [{"purchaseToken":"tokenabc","developerPayload":"mypayload1",
   "packageName":"com.example.MyPackage","purchaseState":0,"orderId":"12345.6789",
   "purchaseTime":1382517909216,"productId":"example_subscription"},
  {"purchaseToken":"tokenxyz","developerPayload":"mypayload2",
   "packageName":"com.example.MyPacakge","purchaseState":0,"orderId":"98765.4321",
   "purchaseTime":1382435077000,"productId":"example_product"}]

* error : The error callback.

#### Purchase
Purchase an item. You cannot buy an item that you already own.

    inappbilling.buy(success, fail, productId)
parameters
* success : The success callback. It provides a json object representing the purchased item as first parameter. Example :

{"orderId":"12999763169054705758.1385463868367493",
"packageName":"com.example.myPackage",
"productId":"example_subscription",
"purchaseTime":1397590291362,
"purchaseState":0,
"purchaseToken":"ndglbpnjmbfccnaocnppjjfa.AO-J1Ozv857LtAk32HbtVNaK5BVnDm9sMyHFJkl-R_hJ7dCSVTazsnPGgnwNOajDm-Q3DvKEXLRWQXvucyW2rrEvAGr3wiG3KnMayn5yprqYCkMNhFl4KgZWt-4-b4Gr29_Lq8kcfKCkI57t5rUmFzTdj5fAdvX5KQ",
"receipt": "{...}",
"signature": "qs54SGHgjGSJHSKJHIU"}  
**The receipt and signature are available in the object for server side validation.**

* error : The error callback.
* productId : The in app billing product id (example "example_subscription")

#### Subscribe
Subscribe to an item

	inappbilling.subscribe(success, fail, subcriptionId)
parameters
* success : The success callback.
* error : The error callback.
* productId : The in app billing product id (example "premium_001")

#### Consume
Consume an item. You can consume an item that you own. Example of consumable items : food, additional life pack, etc. Example of non-consumable item: levels pack. Once an item is consumed, it is not owned anymore.

    inappbilling.consumePurchase(success, fail, productId)
parameters
* success : The success callback. It provides a json object with the transaction details. Example :  
{
	"orderId":"12999763169054705758.1321583410745163",
	"packageName":"com.smartmobilesoftware.trivialdrivePhonegap",
	"productId":"gas",
	"purchaseTime":1369402680000,
	"purchaseState":0,
	"purchaseToken":"ccroltzduesqaxtuuopnqcsc.AO-J1Oyao-HWamJo_6a4OQSlhflhOjQgYWbb-99VF2gcj_CB1dd1Sfp5d-olgouTWJ13Q6vc5zbl0SFfpofmpyuyeEmJ"
}

* error : The error callback.
* productId : The in app billing product id (example "5_lifes")

#### Get Product(s) Details
Load the available product(s) to inventory. Not needed if you use the init(success, error, options, skus) method.  Can be used to update inventory if you need to add more skus.

		inappbilling.getProductDetails(success, fail, skus)
* success : The success callback.
* error : The error callback.
* skus : string or string[] of product skus. ie. "prod1" or ["prod1","prod2]

#### Get Available Product(s)
The list of the available product(s) in inventory.

		inappbilling.getAvailableProducts(success, fail) 
* success : The success callback. It provides a json array of the list of owned products as a parameter. Example :  
{index:
{
	"title":"Infinite Gas",
	"price":"2.99",
	"type":"subs",
	"description":"Lots of Infinite Gas",
	"productId":"infinite_gas",
	"price_currency_code":"USD"
}}

* error : The error callback.


Quick example
---------------
```javascript
inappbilling.init(successInit,errorCallback, {showLog:true})

function successInit(result) {    
	// display the extracted text   
	alert(result); 
	// make the purchase
	inappbilling.buy(successPurchase, errorCallback,"gas");
	
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
		<script type="text/javascript" charset="utf-8" src="phonegap.js"></script>
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
				inappbilling.init(successHandler, errorHandler, {showLog:true});
			}

			// Click on purchase button
			function buy(){
				// make the purchase
				inappbilling.buy(successHandler, errorHandler,"gas");
				
			}
			
			// Click on ownedProducts button
			function ownedProducts(){
				// Initialize the billing plugin
				inappbilling.getPurchases(successHandler, errorHandler);
				
			}

            // Click on Consume purchase button
            function consumePurchase(){

                inappbilling.consumePurchase(successHandler, errorHandler, "gas");
            }

            // Click on subscribe button
            function subscribe(){
                // make the purchase
                inappbilling.subscribe(successHandler, errorHandler,"infinite_gas");

            }
            
			// Click on Query Details button
			function getDetails(){
				// Query the store for the product details
				inappbilling.getProductDetails(successHandler, errorHandler, ["gas","infinite_gas"]);
				
			}
			
			// Click on Get Available Products button
			function getAvailable(){
				// Get the products available for purchase.
				inappbilling.getAvailableProducts(successHandler, errorHandler);
				
			}						
			
        </script>
		
	</head>
	<body>
		<h1>Hello World</h1>
		<button onclick="init();">Initalize the billing plugin</button>
		<button onclick="buy();">Purchase</button>
        <button onclick="ownedProducts();">Owned products</button>
        <button onclick="consumePurchase();">Consume purchase</button>
        <button onclick="subscribe();">Subscribe</button>
        <button onclick="getDetails();">Query Details</button>
        <button onclick="getAvailable();">Get Available Products</button>
    </body>
</html>
```

Common issues
----------------
If you have an issue, make sure that you can answer to theses questions:  
Did you create your item in the Developer Console?  
Is the id for your item the same in the Developer Console and in your app?  
Is your item active? 
Have you uploaded and published your apk in the alpha or beta channels?  You can no longer test in app purchases with an apk in draft mode.
Have you waited at least a few hours since you activated your item and published your apk on the Developer Console?  
Are you using a different Google account than your developer account to make the purchase?
Is the Google account part of a google+ community or group that you invited in the alpha or beta channel?
Using the Google account, did you follow the link that appears in the channel where you published your apk, and accept the invitation to test?
Are you testing on a real device, rather than the emulator?  
Are you using a signed apk?  
Is the version code of your app the same as the one uploaded on the Developer Console?  
  
If any of these questions is answered with a "no", you probably need to fix that.  


MIT License
----------------

Copyright (c) 2012-2014 Guillaume Charhon - Smart Mobile Software

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
