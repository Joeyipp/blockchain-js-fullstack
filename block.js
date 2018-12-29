// A block consists of 4 pieces of data
// 1. timestamp (When it is created)
// 2. lastHash (the hash of the previous block)
// 3. data (represents transaction of data)
// 4. individual hash

// Block Hash
// Generated from the timestamp, given data, and the lastHash
// SHA-256: Secure Hash Algorithm 256 bits <=> Represented as 64-bit hexadecimal
// Produces a unique value for unique input
// Produces the same hash consistently with the same given data
// A one-way function: data to hash

const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    // When 3 or more arguments, arrange the arguments as an object
    // This way, we do not need to remember to order of the arguments
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    // static: Class function
    // Factory Method creates an instance of a Class without using the Constructor Method
    // The use of this refers to the Class
    static genesis() {
        // return new Block(GENESIS_DATA);
        return new this(GENESIS_DATA);
    }

    // Return/ Create a new block
    static mineBlock({ lastBlock, data }) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;

        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data,
            hash: cryptoHash(timestamp, lastHash, data)
        });
    }
}

// const block1 = new Block('01/01/01', 'foo-lastHash', 'foo-hash', 'foo-data');

// const block1 = new Block({
//     timestamp: '01/01/01', 
//     lastHash: 'foo-lastHash', 
//     hash: 'foo-hash', 
//     data: 'foo-data'
// });

// console.log('block1', block1);

module.exports = Block;