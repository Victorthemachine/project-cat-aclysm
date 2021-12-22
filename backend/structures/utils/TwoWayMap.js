
module.exports = class TwoWayMap {
    constructor() {
        this.map = new Map();
        this.reverseMap = new Map();
    }

    /**
     * Gets the value based on the key from collection
     * @param {String | Integer} key 
     */
    get(key) {
        return this.map.get(key);
    }

    /**
     * Gets the key based on the value from collection
     * @param {String | Integer} value 
     */
    fetch(value) {
        return this.reverseMap.get(value);
    }

    /**
     * Adds the key value pair to collection
     * @param {String | Integer} key 
     * @param {String | Integer} value 
     */
    set(key, value) {
        this.map.set(key, value);
        this.reverseMap.set(value, key);
    }

    /**
     * Deletes the key value pair based on key from collection
     * @param {String | Integer} key 
     */
    deleteKey(key) {
        let temp = this.map.get(key);
        this.map.delete(key);
        this.reverseMap.delete(temp);
    }
    
    /**
     * Deletes the key value pair based on value from collection
     * @param {String | Integer} value 
     */
    deleteValue(value) {
        let temp = this.reverseMap.get(value);
        this.map.delete(temp);
        this.reverseMap.delete(value);
    }
}