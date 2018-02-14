# Measurement Framework
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


### User Trail
It uses a cookie to store a users action on a webpage and let you map
thoose actions to a particular state in the user journey using a function.






## Building with rollup
Rollup and other javascript compilers doesn't support removing unused
methods form classes. This is why the measurement framework i built on
running several functions instead of importing a class to hold them.
Internally these uses the MeasurementFramework class to hold state and
to orcestrate between classes. This makes the package nice and tight.

