import customTask from "./customTask"

/**
 * Function takes a number of the dimension that will hold the Client ID.
 * This will be added to every call to Google Analytics.
 *
 * @param clientIdDimension
 */
const clientIdSetter = function (clientIdDimension) {
    customTask(function (model) {
        model.set("dimension" + clientIdDimension, model.get("clientId"))
    })
}

export default clientIdSetter