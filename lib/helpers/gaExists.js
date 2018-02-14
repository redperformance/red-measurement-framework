import window from "window"
import isFunction from "lodash-es/isFunction"

function gaExists() {
    return (isFunction(window.ga) && isFunction(window.ga.getAll))
}

export default gaExists
