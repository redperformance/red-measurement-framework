/**
 * Created by michael on 09/05/2017.
 */
function objMap(data, delim, spl, decode) {
    let obj = {}
    // If one of our parameters is missing, return an empty object
    if (!data || !delim || !spl) {
        return {}
    }
    let arr = data.split(delim)
    let i
    if (arr) {
        for (i = 0; i < arr.length; i++) {
            // If the decode flag is present, URL decode the set
            let item = decode ? decodeURIComponent(arr[i]) : arr[i]
            let pair = item.split(spl)
            let key = trim_(pair[0])
            let value = trim_(pair[1])
            if (key && value) {
                obj[key] = value
            }
        }
    }
    return obj
}

// Basic .trim() polyfill
function trim_(str) {
    if (str) {
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    }
}

export default objMap