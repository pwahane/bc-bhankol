const SHA256 = require("crypto-js/sha256");
const { Block } = require("./Block");
const { Transaction } = require("./Transaction");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Blockchain {
  constructor(difficulty = 3, miningReward = 100) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
    this.pendingTransactions = [];
    this.miningReward = miningReward;
  }

  createGenesisBlock() {
    return new Block(Date.now(), [new Transaction(null, null, 0)], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transactions must have valid to and from addresses");
    }
    try {
      if (transaction.isValid()) {
        this.pendingTransactions.push(transaction);
      }
    } catch (err) {
      throw err;
    }
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    console.log("Block mined successfully");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) balance -= transaction.amount;
        if (transaction.toAddress === address) balance += transaction.amount;
      }
    }
    return balance;
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    if (this.chain.length > 1)
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];
        if (!currentBlock.hasValidTransactions()) return false;
        if (currentBlock.hash !== currentBlock.calculateHash()) return false;
        if (currentBlock.previousHash !== previousBlock.hash) return false;
      }
    return true;
  }
}

module.exports.Blockchain = Blockchain;