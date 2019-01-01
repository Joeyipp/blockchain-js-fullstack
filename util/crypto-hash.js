const crypto = require('crypto');
const hexToBinary = require('hex-to-binary');

// JS spread operator ... collects all input arguments and form an array
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' ')); // Update the hash object with the strings

    return hash.digest('hex');           // Digest turns the string into hash in hexadecimal format
    // return hexToBinary(hash.digest('hex')); // Convert hex to binary
};

module.exports = cryptoHash;