// A wallet serves three purposes
// 1. Gives a user a public address in the system
// 2. Tracks how much balance a user has in his wallet by examining the blockchain history
// 3. Conduct official & cryptographically-secure transactions with other members by generating signatures
const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        // By default, EC generates a pair of X-Y coordinates on the EC curve
        // .encode('hex') converts those coordinates into a nicely-formated heximal values
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }
    
    createTransaction({ recipient, amount }) {
        if(amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        // this refers to the overall instance itself
        return new Transaction({ senderWallet: this, recipient, amount })
    }
}

module.exports = Wallet;
