const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const app = express();
const Blockchain = require('./blockchain')

const blockchain = new Blockchain

const identifier = uuidv4().replace('-','');

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send('hello there')
});

app.post('/transactions/new', (req, res, next) => {
  const {sender, recipient, amount} = req.body;
  let index = blockchain.newTransaction(sender, recipient, amount);

  res.status(201).send(`Transaction will be added to Block ${index}`)
});


app.get('/mine', (req, res, next) => {
  const lastBlock = blockchain.lastBlock()
  console.log(lastBlock)
  let newProof = blockchain.proofOfWork(lastBlock.proof);
  blockchain.newTransaction(0, identifier, 1);
  const previousHash = blockchain.hash(lastBlock);
  const block = blockchain.newBlock(previousHash, newProof)
  const response = {
    message: 'New Block forged',
    index: block.index,
    transactions: block.transactions,
    proof: block.proof,
    previousHash: block.previousHash
  }
  res.json(response)
});

app.get('/chain', (req, res, next) => {
  const chain = {
    chain: blockchain.chain,
    length: blockchain.chain.length
  }
  res.json(chain)
});

app.listen(3000, () => console.log('listening on 3000'))
