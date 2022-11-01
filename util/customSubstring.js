/**
 * Checks if a string is over the provided length and returns a shortened string if it is
 * @param {String} str
 * @param {Number} length 
 */
function customSubstring(str, length) {
    return str.length > length ? str.substring(0, length - 3) + '...' : str.length
};

module.exports = { customSubstring };