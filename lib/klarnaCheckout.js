import window from "window";
import forEach from "lodash-es/forEach";

function klarnaCheckout(klarnaCheckoutCallback) {
    let dataLayerName = "dataLayer";
    if (window._klarnaCheckout && window[dataLayerName]) {
        let klarnaEvents = ["change", "shipping_address_change", "order_total_change", "can_not_complete_order"];
        //let klarnaEvents = ["change"];
        let callBackObj = {};
        forEach(klarnaEvents, function (klarnaEvent) {
            callBackObj[klarnaEvent] = function (data) {
                let dlObj = {
                    "event": "klarna." + klarnaEvent,
                    "klarna": data
                };

                klarnaCheckoutCallback(dlObj);
                window[dataLayerName].push(dlObj);
            };
        });
        console.log(callBackObj);
        window._klarnaCheckout(function (api) {
            console.log("Klarna mounted");
            console.log(api);
            api.on(callBackObj);
        });
    } else {
        console.log("no klarna");
    }

}
export default klarnaCheckout;