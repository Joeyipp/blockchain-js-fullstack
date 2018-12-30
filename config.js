// Scream Case Syntax when the code is using a Global hardcoded value
const MINE_RATE = 1000; // 1 second or 1000 milli-seconds
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
}; 

module.exports = { GENESIS_DATA, MINE_RATE };