const { expect } = require("@jest/globals");
const { Transaction } = require("../Transaction");
const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const { Block } = require("../Block");
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "189a07daf76ada77693f9cbd7590c0bba031128e871364f0553d0b9a54c4d8ec"
);

const myWalletAddress = myKey.getPublic("hex");

describe("Blocks", () => {
  it("should be able to calculate hash", () => {
    const tx = new Transaction("a1", "a2", 10);
    const previousHash = "";
    const timestamp = Date.now();
    const transactions = [tx];
    const nonce = 0;
    const block = new Block(timestamp, transactions, previousHash);
    block.nonce = nonce;
    const hash = block.calculateHash();
    expect(hash).toBeTruthy();
    expect(hash).toBe(
      SHA256(
        previousHash + timestamp + JSON.stringify(transactions) + nonce
      ).toString()
    );
  });

  it("should be able to mine block", () => {
    const tx = new Transaction("a1", "a2", 10);
    const previousHash = "";
    const timestamp = Date.now();
    const transactions = [tx];
    const nonce = 0;
    const block = new Block(timestamp, transactions, previousHash);
    expect(() => block.mineBlock(2)).not.toThrowError();
  });

  it("should be able to check if the block has valid transactions", () => {
    const tx = new Transaction(myWalletAddress, "a2", 10);
    const previousHash = "";
    const timestamp = Date.now();
    tx.signTransaction(myKey);
    const transactions = [tx];
    const block = new Block(timestamp, transactions, previousHash);
    expect(block.hasValidTransactions()).toBeTruthy();
  });

  it("should be able to check if the block has invalid transactions", () => {
    const tx = new Transaction("a1", "a2", 10);
    const previousHash = "";
    const timestamp = Date.now();
    const transactions = [tx];
    const block = new Block(timestamp, transactions, previousHash);
    expect(() => block.hasValidTransactions()).toThrowError();
  });
});
