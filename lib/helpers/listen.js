import window from "window";

function listen(event, callback) {
    if (window.addEventListener) {
        window.addEventListener(event, callback);
    } else if (window.attachEvent) {
        window.attachEvent('on' + event, callback);
    }
}

export default listen;