function attrib(elementObj, attributeName) {
    return elementObj && attributeName && elementObj.attributes && elementObj.attributes[attributeName] ? elementObj.attributes[attributeName].value : null;
}
export default attrib;
