import MeasurementFramework from "./MeasurementFramework";

const clientIdSetter = function (clientIdDimension) {
    MeasurementFramework.customTask(function (model) {
        model.set("dimension" + clientIdDimension, model.get("clientId"));
    });
}

export default clientIdSetter;