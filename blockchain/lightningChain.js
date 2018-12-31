// Create a unique value for each input data
const lightningHash = (data) => {
    return data + '*';
}

class Block {
    constructor(data, hash, lastHash) {
        this.data = data;           // Storage unit
        this.hash = hash;           // Unique ID for this block
        this.lastHash = lastHash;   // Create a link between this block and the previous block
    }
}

class Blockchain {
    constructor() {
        // The very first block of the chain
        const genesis = new Block('gen-data', 'gen-hash', 'gen-lastHash');

        this.chain = [genesis];
    }

    addBlock(data) {
        const lastHash = this.chain[this.chain.length-1].hash;
        const hash = lightningHash(data + lastHash);
        const block = new Block(data, hash, lastHash);

        this.chain.push(block);
    }
}

const fooBlockchain = new Blockchain();
fooBlockchain.addBlock('one');
fooBlockchain.addBlock('two');
fooBlockchain.addBlock('three');

console.log(fooBlockchain);

// const fooBlock = new Block('foo-data', 'foo-hash', 'foo-lastHash');
// console.log(fooBlock);