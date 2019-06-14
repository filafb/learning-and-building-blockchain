const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const app = express();
const Blockchain = require('./blockchain')

var PORT = process.env.PORT || 3000;

const blockchain = new Blockchain

const identifier = uuidv4().replace(/-/g,'');

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
  console.log('I got a request')
  const chain = {
    chain: blockchain.chain,
    length: blockchain.chain.length
  }
  console.log('my response is', chain)
  res.json(chain)
});

app.post('/nodes/register', (req, res, next) => {
  let { nodes } = req.body
  for(let i = 0; i < nodes.length; i++) {
    blockchain.registerNodes(nodes[i]);
  }
  let response = {
    message: 'new node added',
    totalNode: [...blockchain.nodes]
  }
  console.log(blockchain.nodes)
  res.status(201).json(response)
});

app.get('/nodes/resolve', async (req, res, next) => {
  let replaced = await blockchain.resolveConflicts();
  let response
  console.log('replaced',replaced)
  if(replaced) {
    response = {
      message: 'Our chain was replaced',
    }
  } else {
    response = {
      message: 'Our chain is authoritative'
    }
  }
  response.chain = blockchain.chain
  res.json(response)
})

app.listen(PORT, () => console.log(`listening on ${PORT}`))
