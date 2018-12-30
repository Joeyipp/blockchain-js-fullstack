const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

    replaceChain(incomingChain) {
        if (incomingChain.length <= this.chain.length) {
            console.error('The incoming chain must be longer.');
            return;
        }

        if (!Blockchain.isValidChain(incomingChain)) {
            console.error('The incoming chain must be valid.')
            return;
        }

        console.log('replacing chain with', incomingChain);
        this.chain = incomingChain;
    }

    static isValidChain(chain) {
        // 2 JS object will only be the same if they are the same underlying object instance
        // Therefore, in the case, we are only concern the data of chain[0] to be the data from genesis Block
        // Use JSON.stringify() to convert the object to string and then compare their value
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i=1; i<chain.length; i++) {
            const block = chain[i];
            const actualLastHash = chain[i-1].hash;
            const { timestamp, lastHash, hash, data, nonce, difficulty } = block;
            const lastDifficulty = chain[i-1].difficulty;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if (hash !== validatedHash) return false;

            // Check difficulty changes in both direction never exceed 1 at a time
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    }
}

module.exports = Blockchain;