import window from "window";
import isFunction from "lodash-es/isFunction";

function fbqExists() {
    return (isFunction(window.fbq) && isFunction(window.fbq.getState));
}
export default fbqExists;