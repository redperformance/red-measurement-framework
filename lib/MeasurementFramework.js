/**
 * Singelton object to register all user functions.
 */
import dataLayerPush from "./helpers/dataLayerPush"
import forEach from "lodash-es/forEach"
import isUndefined from "lodash-es/isUndefined"
import isFunction from "lodash-es/isFunction"

class MeasurementFramework {

    constructor() {
        this.registered = []
        this.vars = {}
        this.a = "__mf_lock"
    }

    register(func) {
        if (isFunction(func)) {
            this.registered.push(func)
        } else {
            console.warn("Measurement Framework received a non-function.", func)
        }

    }

    init() {
        let self = this
        if (isUndefined(window[this.a])) {
            console.log("Measurement Framework Loaded with " + this.registered.length + " tasks.")
            forEach(this.registered, function (registeredFunc) {
                let funcInitDataLayer = registeredFunc()
                forEach(funcInitDataLayer, function (value, key) {
                    self.vars[key] = value
                })
            })
            window[this.a] = true
            dataLayerPush("Measurement Framework Loaded", {
                "mfDebug": this.registered.length + " tasks registered."
            })
            return self.vars
        } else {
            console.log("Measurement Framework already loaded. Skipping initialization")
        }

    }
}


export default new MeasurementFramework()