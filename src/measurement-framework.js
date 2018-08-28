import MeasurementFramework, {
    contentEngaged,
    userTrail,
    clientIdSetter,
    customTask,
    ajaxComplete
} from "measurement-framework"
import * as event from "./events";
import events from "./events";
import {greater} from "measurement-framework/lib/userTrail";


let eventName = "Content Viewed" // Event name
let secondsToTrigger = 20 // Event rule to trigger after x seconds

contentEngaged(eventName, secondsToTrigger, function (dataLayerPush) { // Debugging
    dataLayerPush.debugText = "Target time for Content Viewed is 20 seconds."
})


customTask(function (model) {
    let tid = model.get("&tid");
    console.log("GATID: ", tid);
});


// Ajax Complete Example
ajaxComplete(function (request, response) {
});


// Client ID setter Example. (Dimension 1)
clientIdSetter(1);

//Usertrail Example, defining multiple events to create one segment
userTrail(events, [
    function () {
        return "Aware";
    },
    function () {
        return (
            greater(event.CONTENT_VIEWED, 0) ||
            greater(event.EMAGAZINE_LINK_CLICKED, 0) ||
            greater(event.CATEGORY_LIST_VIEWED, 0) ||
            greater(event.PRODUCT_VIEWED, 0) ||
            greater(event.BRAND_LIST_VIEWED, 0) ||
            greater(event.INTERNAL_SEARCH_RESULTS, 0) ||
            greater(event.INTERNAL_SEARCH_NO_RESULTS, 0) ||
            greater(event.SOCIAL_LINK_CLICKED, 0) ||
            greater(event.PROMOTION_MAIN_CLICKED, 0) ||
            greater(event.PADD_FILTER_PRODUCT_LIST, 0) ||
            greater(event.SORT_BY, 0) ||
            greater(event.PRODUCT_SHARED, 0)
        ) ? "Interested" : false;
    },
    function () {
        return (
            greater(event.NEWSLETTER_SUBSCRIBED, 0) ||
            greater(event.ADD_FILTER_PRICERANGE, 0) ||
            greater(event.PRODUCT_VIEWED, 1) ||
            greater(event.RETAIL_OUTLET_VIEWED, 1) ||
            greater(event.FINANCIAL_LINK_CLICKED, 0) ||
            greater(event.ASSEMBLY_FILE_DOWNLOADED, 0)
        ) ? "Considering" : false;
    },
    function () {
        return (
            greater(event.MAILTO_LINK_CLICKED, 0) ||
            greater(event.PHONE_LINK_CLICKED, 0) ||
            greater(event.PRODUCT_REQUEST_SENT, 0) ||
            greater(event.RETAIL_MAP_LOCATION, 0) ||
            greater(event.RETAIL_MAP_ENGAGED, 0)
        ) ? "Store Visit Intent" : false;
    }
    ,
    function () {
        return (
            greater(event.INSPECTION_FORM_SUBMITTED, 0)
        ) ? "Lead" : false;
    }
]);


MeasurementFramework.init()

