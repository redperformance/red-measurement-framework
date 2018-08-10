RED Measurement Framework
=======
[![NPM Version][npm-image]][npm-url]
![Stability][stability-image]

## Outline

The RED Measurement Framework (RMF) is a collection of javascript code that is to be implemented in a browser based measurement system for tracking of events on websites. 

It´s composed of several functions that integrate
with:

* Google Tag Manager (GTM) 
* Google Analytics (GA)
* jQuery.

## Functional resume

As can be seen from the /dist/measurement-framework.js file, a structured set of operations coupled with the use of a consistent naming convention ensures desired functionality. 

Basically outlined, the above allows for the placement of consumers in segments by utilizing cookie based consumer data and accumulating (n) number of (x,y or z) events. As such, the mapping of web based consumer behavior to create consumer segments. 

Exemplary segments could be:

* Aware
* Interested
* Considering 
* Store Visit Intent 
* Ecommerce Intent
* Ecommerce Purchase

## The backbone of RMF
The following files can be found in the lib folder and are the backbone of the RMF. The below list presents these files and explains their functional intent.

* **ajaxComplete.js (jQuery)**
	* A set of operations that configures the tracking of asynchronous javascript and xml (AJAX).   
		 
* **clientIdSetter.js**
	* An operation that fetches the client ID (a numeric value that will be added to every call towards GA).
		 
* **contentEngaged.js**
	* A set of operations to measure consumer engagement based on i.e. clicks, movement, scrolls etc. A predetermined threshold (usually between 15-20 seconds of activty) defines when a consumer is considered engaged in page content.

* **customTask.js**
	* A set of operations that utilizes the recently released task API from Universal Analytics, which lets you modify a dispathed payload fired to GA. Enabling the sending of i.e. client ID to GA.  

* **domReady.js**
	* A set of operations that allows document object model (DOM) ready events to be fired to GA via callback funtionality. (**needs cofirmation from Asim**)

* **klarnaCheckout.js**
	* An operation that lets you track stages in klarnacheckouts, i.e. shipping address changed, order total changed and cannot complete order.

* **sendHitTask.js**


* **userTrail.js**
	* A set of operations that relies on the use of cookies to store consumer web based actions leading to segmentation of consumers.



## Installation 


## Building with rollup
Rollup and other javascript compilers doesn't support removing unused
methods form classes. This is why the measurement framework is https://cid-26cb80f405dfaf84.users.storage.live.com/users/0x26cb80f405dfaf84/myprofile/expressionprofile/profilephoto:UserTileStatic,UserTileSmall/MeControlMediumUserTile?ck=1&ex=24&fofoff=1built on
running several functions instead of importing a class to hold them.
Internally, these use the MeasurementFramework class to hold state and
to orchestrate between classes. This makes the package nice and tight.

[npm-image]: https://img.shields.io/npm/v/measurement-framework.svg
[npm-url]: https://npmjs.org/package/measurement-framework
[stability-image]: https://img.shields.io/badge/stability-experimental-orange.svg
[stability-url]: https://github.com/mijohansen/measurement-framework