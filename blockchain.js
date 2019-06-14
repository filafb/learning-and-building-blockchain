const crypto = require('crypto');
const parse = require('url-parse');
const axios = require('axios');

class Blockchain {
  constructor(genesisHash=1, genesisProof=100) {
    this.chain = [];
    this.currentTransactions = [];
    this.lastBlock = function () {
      // returns the last block in the chain
      return this.chain[this.chain.length - 1];
    };
    this.nodes = new Set;
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
  };

  registerNodes(address) {
    const parsedURL = parse(address);
    this.nodes.add(parsedURL.host);
  };

  validChain(chain) {
    let lastBlock = chain[0];
    let currentIndex = 1;
    while(currentIndex < chain.length) {
      let block = chain[currentIndex];
      console.log(`${lastBlock}`);
      console.log(`${block}`);
      console.log('-----------------');
      if(block.previousHash !== this.hash(lastBlock)){
        return false
      };
      if(!this.validProof(lastBlock.proof, block.proof)) {
        return false
      }
      lastBlock = block;
      currentIndex += 1;
    }
    return true
  }

  async resolveConflicts(){
    let neighbours = this.nodes;
    console.log('neighbours', neighbours)
    let newChain = null;
    let maxLength = this.chain.length;
    for(let node of neighbours.values()) {
      console.log(neighbours.has(node))
      if(neighbours.has(node)){
        try{
          console.log(`http://${node}/chain`)
          let { data, status } = await axios.get(`http://${node}/chain`);

          if(status === 200) {
            console.log('data', data)
            let length = data.length;
            let chain = data.chain;
            console.log('length', length, 'maxLength', maxLength)
            console.log('length > maxLength', length > maxLength, 'valid', this.validChain(chain) )
            if( length > maxLength && this.validChain(chain)) {
              maxLength = length;
              newChain = chain;
            }
          }

        } catch(e) {
          console.log(e)
          return false
        }
      }
    }
    if(newChain) {
      this.chain = newChain
      return true
    }
    return false
  }

}

module.exports = Blockchain


