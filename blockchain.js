const crypto = require('crypto');

class Blockchain {
  constructor(genesisHash=1, genesisProof=100) {
    this.chain = [];
    this.currentTransactions = [];
    this.lastBlock = function () {
      // returns the last block in the chain
      return this.chain[this.chain.length - 1];
    };
    //create the genesis block
    this.newBlock(genesisHash, genesisProof);

  };
  newBlock(previousHash, proof) {
    //creates a new block and adds it to the chain
    const block = {
      index: this.chain.length + 1,
      timestamp: Math.floor( Date.now() / 1000 ),
      transactions: this.currentTransactions,
      proof,
      previousHash: previousHash || this.hash(this.lastBlock())
    };

    this.currentTransactions = [];
    this.chain.push(block);
    return block

  };
  newTransaction(sender, recipient, amount){
    // adds a new transaction to the list of transactions. It goes into the next mined block
    const transaction = {
      sender,
      recipient,
      amount
    }
    this.currentTransactions.push(transaction);
    //The index of the Block that will hold this transaction
    return this.lastBlock().index + 1
  };
  hash(block) {
    //hashes a block
    const blockString = JSON.stringify(block)
    return crypto
    .createHash('RSA-SHA256')
    .update(blockString)
    .digest('hex')
  };

  proofOfWork(lastProof) {
    let proof = 0;
    while(!this.validProof(lastProof, proof)) {
      proof+=1
    }
    return proof
  }
  validProof(lastProof, proof) {
    let guess = `${lastProof}${proof}`
    let guessHash = crypto
    .createHash('RSA-SHA256')
    .update(guess)
    .digest('hex')
    return guessHash.substring(guessHash.length - 4) === '0000'
  }
}

module.exports = Blockchain


