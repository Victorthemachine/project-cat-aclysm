/**
 * This functions as a two way map.
 * In other words key points to value and value to key.
 * For music use it as, VoiceChannel : TextChannel
 */
module.exports = class TwoWayMap {

    //I used to have maps here, then it all broke for some reason
    //sadly I can't find any sources online that it might be due to node
    //So I can only assume it's somehow conflicting with other depos?
    //Also this is intentionally part of constructor and accessible
    //It's not so it can be modified but rather debugged at any part of app
    constructor() {
        this.map = {};
        this.reverseMap = {};        
    }

    /**
     * Gets the value based on the key from collection
     * @param {String | Integer} key 
     * 
     * @returns {String | Integer | undefined} returns value, or undefined if doesn't exist
     */
    get(key) {
        if (this.#checkForKeyValidity(key, this.map) === true) {
            return this.map[String(key)];
        } else return undefined;
    }

    /**
     * Gets the key based on the value from collection
     * @param {String | Integer} value
     * 
     * @returns {String | Integer | undefined} returns key, or undefined if doesn't exist
     */
    fetch(value) {
        //console.log(`Fetching key for value: ${value}`);
        //console.log(Object.keys(this.map));
        //console.log(Object.keys(this.reverseMap));
        if (this.#checkForKeyValidity(value, this.reverseMap) === true) {
            return this.reverseMap[String(value)];
        } else return undefined;
    }

    /**
     * Adds the key value pair to collection
     * @param {String | Integer} key 
     * @param {String | Integer} value 
     */
    set(key, value) {
        this.map[String(key)] = String(value);
        this.reverseMap[String(value)] = String(key);
    }

    /**
     * Deletes the key value pair based on key from collection
     * @param {String | Integer} key 
     * 
     * @return {Boolean} true - deleted; false - doesn't exist
     */
    deleteKey(key) {
        let temp = this.get(key);
        //Note if temp exists, means the key exists therefore no check necessary
        if (temp) {
            delete this.map[String(key)];
            //temp is already String no need to convert again
            return delete this.reverseMap[temp];
        } else {
            return false;
        }
    }

    /**
     * Deletes the key value pair based on value from collection
     * @param {String | Integer} value 
     * 
     * @return {Boolean} true - deleted; false - doesn't exist
     */
    deleteValue(value) {
        let temp = this.fetch(value);
        //Note if temp exists, means the key exists therefore no check necessary
        if (temp) {
            delete this.reverseMap[String(value)];
            //temp is already String no need to convert again
            return delete this.map[temp];
        } else {
            return false;
        }
    }

    #checkForKeyValidity(key, object) {
        return Object.keys(object).includes(key);
    }
}