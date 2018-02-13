import isJson from "is-json";

function ajaxCompleteNative(callback) {
    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("progress", function () {
            console.log("Loading");
        }, false);

        this.addEventListener("load", function () {
            if (isJson(this.responseText)) {
                var responseJSON = JSON.parse(this.responseText);
                console.log("responses", responseJSON);
            }
            console.log("xhr", this);
            console.log("body", body);
        }, false);
        this.realSend(body);
    };
}

export default ajaxCompleteNative;