import forEach from "lodash-es/forEach"
import merge from "lodash-es/merge"
import customTask from "./customTask"
import isFunction from "lodash-es/isFunction"
import dataLayerPush from "./helpers/dataLayerPush"

let sendHitTaskFunctions = []
let customFunctionIsMounted = false
/**
 * Registering the Send Hit Task Callback
 */



export default function sendHitTask(func) {
    if (isFunction(func)) {
        sendHitTaskFunctions.push(func)
        if (!customFunctionIsMounted) {
            customTask(function (model) {
                // Grab a reference to the default sendHitTask function.
                const taskToOverride = 'sendHitTask'
                const originalSendHitTask = model.get(taskToOverride)
                // The tracking system will allow for the maximum of one custom Task, this function let us have infinite.
                model.set(taskToOverride, function (sendHitTaskModel) {
                    let dataLayerObject = {}
                    console.log("sendHitTaskRunner running these tasks: ", sendHitTaskFunctions)
                    forEach(sendHitTaskFunctions, function (taskFunction) {
                        try {
                            /**
                             * Wrapping this in a try/catch as its madly critical.
                             */
                            let functionResult = taskFunction(sendHitTaskModel)
                            dataLayerObject = merge(dataLayerObject, functionResult)
                        } catch (e) {
                            console.error(e.message)
                        }
                    })
                    originalSendHitTask(sendHitTaskModel)
                    dataLayerObject.debug = "Registered " + sendHitTaskFunctions.length + " number of hit-tasks."
                    dataLayerObject.hitPayload = sendHitTaskModel.get('hitPayload')
                    /**
                     * There is no function to aggregate the result from these functions as they are rolled async.
                     * Pushing direct To
                     */
                    dataLayerPush(taskToOverride, dataLayerObject)
                })

            })
            customFunctionIsMounted = true
        }
    } else {
        console.warn("Measurement Framework received a non-function.", func)
    }
}