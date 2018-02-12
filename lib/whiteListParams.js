import dataLayerPush from "./helpers/dataLayerPush";
import forEach from "lodash-es/forEach"

const whiteListParams = function () {
    let window_location_search_whitelisted = [];
    forEach(window.location.search,function(){

    });
    let query_params = window_location_search_whitelisted
    /*
    let new_document_location = window.location + build_query_string(query_params);

    dataLayerPush({
        "document_location":new_document_location
    });
    */
}

export default whiteListParams;