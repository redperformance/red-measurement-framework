Measurement Framework
=======
[![NPM Version][npm-image]][npm-url]
![Stability][stability-image]

Collection of Javascript code to implement a browser based measurement
system for websites. Its created of several functions that integrate
with Google Tag Manager, Google Analytics and jQuery.



## Install



## Functions
* AjaxComplete (jQuery)
* Client ID Setter for Google Analytics
* Content Engagement
* Custom Task in GA
* DomReady
* KlarnaCheckout Hooks
* Kudakeru (Tracking code for the
* Iframe to Parent Messages
* SendHitTask for GA
* User Trail


## Usage


### User Trail
It uses a cookie to store a users action on a web-page and lets you map
those actions to a particular state in the user journey using a function.

### Content Engagement
The module is created to measure users based on "engaged" time and not actual
time. Engaged time is defined as the time a user clicks, scrolls, moving the mouse
or using the keyboard. Its heavily inspired by 
[Simo Ahava's script from 2016](https://www.simoahava.com/analytics/track-content-engagement-via-gtm/) but can
trigger multiple events, should be a little bit more precise and consistent.

```javascript
import MeasurementFramework, {contentEngaged} from "measurement-framework"

let eventName = "Content Viewed"
let secondsToTrigger = 12 

contentEngaged(eventName, secondsToTrigger, function (dataLayerPush) {
    dataLayerPush.debugText = "Target time for Content Viewed is 12 seconds."
})

MeasurementFramework.init()
```

The script could also be used to measure Real Time on site. 


## Building with rollup
Rollup and other javascript compilers doesn't support removing unused
methods form classes. This is why the measurement framework is built on
running several functions instead of importing a class to hold them.
Internally, these use the MeasurementFramework class to hold state and
to orchestrate between classes. This makes the package nice and tight.

[npm-image]: https://img.shields.io/npm/v/measurement-framework.svg
[npm-url]: https://npmjs.org/package/measurement-framework
[stability-image]: https://img.shields.io/badge/stability-experimental-orange.svg
[stability-url]: https://github.com/mijohansen/measurement-framework


## Brief outline
As can be seen from the measurement-framework.js script, its functionality relies heavily on an underlying strict and consistent
naming convention. This allows for the accumulation of (n) number of (x,y or z) instances.
Based on the summation of each instance, it enables the placement of consumers in a given funnel-stage.
Current funnel-stages are "Interested, Considering, Store Visit Intent and Ecommerce Intent"