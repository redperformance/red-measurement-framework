/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function UpdateObj() {
    this.updates = {};
    /**
     *
     * @param {string} id
     * @param {string} propKey
     * @param {string} propVal
     * @returns {undefined}
     */
    this.addProp = function (id, propKey, propVal) {
        if (typeof this.updates[id] === "undefined") {
            this.updates[id] = {
                "id": id
            };
        }
        if (id && propKey && propVal) {
            this.updates[id][propKey] = propVal;
        }
    };
    /**
     *
     * @returns {updateObj.updates}
     */
    this.getUpdates = function () {
        return this.updates;
    };

}


export default UpdateObj;