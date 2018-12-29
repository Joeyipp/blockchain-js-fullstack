const crypto = require('crypto');

// JS spread operator ... collects all input arguments and form an array
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.sort().join(' ')); // Update the hash object with the strings

    return hash.digest('hex'); // Digest turns the string into hash in hexadecimal format
};

module.exports = cryptoHash;