# Learning and Building Block Chain
`npm install` & `npm start`

[Source](https://hackernoon.com/learn-blockchains-by-building-one-117428612f46) by @van_flymen

## What is blockchain?
  - An immutable, sequential chain of records called *Blocks*
  - Can contain any data
  - Chained using hashes

### What is a hash? ==> https://learncryptography.com/hash-functions/what-are-hash-functions

### What does a block Look like?
  - Each block has:
    - An index;
    - A timestamp;
    - List of transactions;
    - A proof;
    - The hash of the previous block

```js
block = {
  index: 1,
  timestamp: 1506057125.900785,
  transactions: [
    {
      sender: "8527147fe1f5426f9dd545de4b27ee00",
      recipient: "a77f5cdfa2934df3954a5c7c7da5df1f",
      amount: 5
    },
  ],
  proof: 324984774000,
  previousHash: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}
```

Crucial for blockchain immuatability:
  - Each block contains the hash of the previous block

## The genesis block = a block with no predecessors

## Understanding Proof of Work
  - Proof of Work algorithm (PoW) is how new Blocks are created or mined.
  - Its goal is to discover a number which solves a problem. The number must be difficult to find but easy to verify

## Consensus
  - Making the blockchain decentralized
