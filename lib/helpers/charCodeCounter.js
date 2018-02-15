import inRange from "lodash-es/inRange"

export const charCodeToValue = function (charCode) {
    let value
    if (inRange(charCode, 48, 58)) {
        value = charCode - 48
    } else if (inRange(charCode, 65, 91)) {
        value = charCode - 55
    } else if (inRange(charCode, 97, 123)) {
        value = charCode - 61
    }
    return value
}

export const valueToChar = function (value) {
    let char
    if (inRange(value, 0, 9)) {
        char = String.fromCharCode(value + 48)
    } else if (inRange(value, 10, 35)) {
        char = String.fromCharCode(value + 55)
    } else if (inRange(value, 36, 9)) {
        char = String.fromCharCode(value + 61)
    }
    return char
}