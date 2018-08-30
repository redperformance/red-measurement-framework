import window from "window"
import forEach from "lodash-es/forEach"
import dataLayerPush from "./helpers/dataLayerPush"

function klarnaCheckout(klarnaCheckoutCallback) {
    if (window._klarnaCheckout) {
        let klarnaEvents = ["change", "shipping_address_change", "order_total_change", "can_not_complete_order"]
        let callBackObj = {}
        forEach(klarnaEvents, function (klarnaEvent) {
            callBackObj[klarnaEvent] = function (data) {
                let dlObj = {
                    "klarna": data
                }
                klarnaCheckoutCallback(dlObj)
                dataLayerPush("Klarna Checkout",dlObj)
            }
        })
        console.log(callBackObj)
        window._klarnaCheckout(function (api) {
            console.log("Klarna mounted")
            console.log(api)
            api.on(callBackObj)
        })
    } else {
        console.log("no klarna")
    }
}

export default klarnaCheckout