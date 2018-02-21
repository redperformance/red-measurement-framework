import window from "window"
import dataLayerPush from "./helpers/dataLayerPush"

function klarnaShippingChanged(klarnaCheckoutCallback) {
    if (window._klarnaCheckout) {
        window._klarnaCheckout(function (api) {
            api.on({
                "shipping_address_change": function (data) {
                    let dlObj = {
                        "klarna": data
                    }
                    klarnaCheckoutCallback(dlObj)
                    dataLayerPush("klarnaShippingChanged", dlObj)
                }
            })
        })
    }
}

export default klarnaShippingChanged