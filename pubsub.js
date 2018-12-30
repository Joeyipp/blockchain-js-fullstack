// PubSub = Publisher/ Subscriber
// Does not need to know the addresses of other nodes in the network
// Install redis: https://redis.io/topics/quickstart
// Start redis server in the background: redis-server --daemonize yes

const redis = require('redis');

const CHANNELS = { 
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        
        // Async functions, takes time to register publisher message
        // this.subscriber.subscribe(CHANNELS.TEST);
        // this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
        this.subscribeToChannels();
        
        this.subscriber.on('message', (channel, message) => {
            this.handleMessage(channel, message);
        });
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        // Create an array based on the values of CHANNELS Object
        Object.values(CHANNELS).forEach((channel) => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain) // Message can only take in string, not array!
        });
    }
}

module.exports = PubSub;

// const testPubSub = new PubSub();

// setTimeout(() => {
//     testPubSub.publisher.publish(CHANNELS.TEST, 'foo')
// }, 1000);