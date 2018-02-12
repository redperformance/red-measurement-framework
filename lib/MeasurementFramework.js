/**
 * Singelton object to register all user functions.
 */
import dataLayerPush from "./helpers/dataLayerPush";
import forEach from "lodash-es/forEach";
import merge from "lodash-es/merge";

class MeasurementFramework {
    constructor() {
        console.log("Measurement Framework constructed");
        this.registered = [];
        this.customTasks = [];
    }

    register(func) {
        this.registered.push(func);
    }

    customTask(func) {
        this.customTasks.push(func);
    }

    customTaskRunner(customTaskModel) {
        // Grab a reference to the default sendHitTask function.
        const taskToOverride = 'sendHitTask';
        let originalSendHitTask = customTaskModel.get(taskToOverride);
        // The tracking system will allow for the maximum of
        customTaskModel.set(taskToOverride, function (sendHitTaskModel) {
            let dlObj = {};
            forEach(this.customTasks, function (customTask, index) {
                /**
                 * Wrapping this in a try/catch as its madly critical.
                 */
                try {
                    let result = customTask.call(sendHitTaskModel);


                } catch (e) {
                    console.error(e.message);
                }
            });
            originalSendHitTask(sendHitTaskModel);
            dataLayerPush(dlObj, "Custom Task Runner Fired");
        });
    }

    init() {
        if (true) {
            console.log("Measurement Framework Loaded");
            let initDataLayer = {
                "customTaskRunner": this.customTaskRunner
            }
            forEach(this.registered, function (func) {
                initDataLayer = merge(initDataLayer, func.call({}));
            });
            dataLayerPush(initDataLayer, "Measurement Framework Loaded");
        }

    }
}


export default new MeasurementFramework();