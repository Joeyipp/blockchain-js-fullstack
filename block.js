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

// Chain Validation
// 1. Correct block fields present (timestamp, lastHash, data, hash)
// 2. Actual lastHash reference
// 3. Valid Hash consisting of timestamp, data, and lasthash

// Chain Replacement
// Replace its own chain with a new chain of blocks
// Blockchain network: All chains come to an unanimous agreement on the true longest blockchain

// Proof-of-Work
// Requires blockchain contributors to spend computational power to mine a block
// Electricity & cpu time to add a block
// Deters attackers from rewriting the whole blockchain history with corrupt and invalid data
// Adding one block is not an expensive task as long as a block is valid and is based on the existing valid chain from the Genesis block onward

// Hashcash (1997) Email-spam & DDos inspired Bitcoin Proof-of-Work (PoW)
// Goal of PoW Mining: Finding the right combination of data, NONCE, and lastHash to meet the leading zero difficulty requirement
// Find a hash-value that matches the difficulty ie. find the same number of leading zeros
// To solve the proof-of-work, miners have to generate a tons of hashes and find one that satisfy the difficulty
// Regenerate the hashes from the same block based on the block data with an adjusting value: NONCE
// Finding the NONCE that unlocks a hash that meets the difficulty requirement is that very Proof-of-Work
// Bitcoin uses binary form of SHA-256 (256 zeros and ones)

// Difficulty setting controls the overall mining rate: How long it takes to add a block
// Dynamically adjust the mining rate to meet the set average mining rate (Bitcoin blocktime ~ 10mins per block)
// Blocktime: tradeoff between propagation time of new blocks in large networks and the amount of work wasted due to chain splits.
// The block time is an average time. It is a measure of how long it will take the hashing power of the network to find a solution to the block hash. 
// The difficulty is calculated proportionally to the hashing power.
// "Satoshi estimated block propagation time to be 1 minute, and chose 10-minute block intervals because "wasting" 10% of mining work was a fair amount."

// 51% Attack: Generate long-enough chain and solve enough PoW puzzles to generate a chain that everyone else have to accept.
// PoW: Deter attackers & control the rate of block being added

const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    // When 3 or more arguments, arrange the arguments as an object
    // This way, we do not need to remember to order of the arguments
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
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
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;

        // The Proof-of-Work Algorithm with Dynamically-adjusted Difficulty
        // Keep generating hashes until the difficulty requirement (no. of leading zeroes) is met!
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            // console.log(`Difficulty: ${difficulty}, Hash: ${hash}`);

            // Do the difficulty check based on Binary form of the hexadecimal hash for a finer grain check
            // Similar to the Bitcoin Protocol
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data,
            difficulty,
            nonce,
            hash
            // hash: cryptoHash(timestamp, lastHash, data, nonce, difficulty)
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;

        // Prevents the difficulty from going to zero or negative value
        if (difficulty < 1) return 1;

        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
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