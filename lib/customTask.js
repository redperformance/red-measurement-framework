import isFunction from "lodash-es/isFunction"
import MeasurementFramework from "./MeasurementFramework"
import forEach from "lodash-es/forEach"

let customTaskFunctions = []

export default function customTask(func) {
    if (isFunction(func)) {
        customTaskFunctions.push(func)
        MeasurementFramework.register(function () {
            return {
                'customTaskRunner': function () {
                    return function (customTaskModel) {
                        forEach(customTaskFunctions, function (taskFunction) {
                            try {
                                /**
                                 * Wrapping this in a try/catch as its madly critical.
                                 */
                                taskFunction(customTaskModel)
                            } catch (e) {
                                console.error("customTaskRunner error: ", e.message)
                            }
                        })
                        /**
                         * Taskrunner returns a common status.
                         */
                    }
                },
                'customTasksRegistered': customTaskFunctions.length
            }
        })
    } else {
        console.warn("Measurement Framework received a non-function.", func)
    }

}