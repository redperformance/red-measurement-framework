import isFunction from "lodash-es/isFunction"
import MeasurementFramework from "./MeasurementFramework"
import forEach from "lodash-es/forEach"
//import dataLayerPush from "./helpers/dataLayerPush";
//import merge from "lodash-es/merge";

let customTaskFunctions = []

export default function customTask(func) {
    if (isFunction(func)) {
        customTaskFunctions.push(func)
        MeasurementFramework.register(function () {
            return {
                "customTaskRunner": function (customTaskModel) {
                    //let dlObj = {};
                    forEach(customTaskFunctions, function (taskFunction) {
                        try {
                            /**
                             * Wrapping this in a try/catch as its madly critical.
                             */
                            taskFunction(customTaskModel)
                            //dlObj = merge(dlObj, resultObj);
                        } catch (e) {
                            console.error("customTaskRunner error: ", e.message)
                        }
                    })
                    /**
                     * Taskrunner returns a common status.
                     */
                    //dataLayerPush(dlObj, "Custom Task Runner Finished");
                },
                "customTasksRegistered": customTaskFunctions.length
            }
        })

    } else {
        console.warn("Measurement Framework received a non-function.", func)
    }

}