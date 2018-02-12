# Measurement Framework
Collection of Javascript code to implement a browser based measurement system for websites. It uses a
cookie to store a users action on a webpage and let you map thoose actions to a particular state in the
user journey.


## Install



## Cave eats
Rollup and other javascript compilers doesn't support removing unused methods form classes. This is why the measurement
framework i built on running several functions instead of importing a class to hold them. Internally these uses the
MeasurementFramework class to hold state and to orcestrate between classes.