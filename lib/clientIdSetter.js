import customTask from "./customTask";

const clientIdSetter = function (clientIdDimension) {
    customTask(function (model) {
        model.set("dimension" + clientIdDimension, model.get("clientId"));
    });
};

export default clientIdSetter;