const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

// Create a new Elliptic Curve instance based on the Bitcoin secp256k1 algorithm
// sec = standards of efficient cryptography prime 256 bits Koblitz 1 (1st implementation)
const ec = new EC('secp256k1');

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySignature , cryptoHash };