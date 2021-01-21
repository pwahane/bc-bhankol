const { expect } = require("@jest/globals");
const { Transaction } = require("../Transaction");
const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const { Blockchain } = require("../Blockchain");
const { Block } = require("../Block");

const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "189a07daf76ada77693f9cbd7590c0bba031128e871364f0553d0b9a54c4d8ec"
);

const myWalletAddress = myKey.getPublic("hex");

describe("Blockchain", () => {
  it("should be able to create genesis block", () => {
    const blockChain = new Blockchain();
    expect(blockChain.chain[0]).toBeTruthy();
    expect(blockChain.chain[0].transactions[0]).toBeTruthy();
    expect(blockChain.chain[0].transactions[0].fromAddress).toBeFalsy();
    expect(blockChain.chain[0].transactions[0].toAddress).toBeFalsy();
    expect(blockChain.chain[0].transactions[0].amount).toBe(0);
  });

  it("should return the latest block", () => {
    const blockChain = new Blockchain();
    expect(blockChain.getLatestBlock()).toBeTruthy();
    expect(blockChain.getLatestBlock().transactions.length).toBe(1);
  });

  it("should be able to add new transaction", () => {
    const blockChain = new Blockchain();
    const tx = new Transaction(myWalletAddress, "a2", 10);
    tx.signTransaction(myKey);
    const ptt = blockChain.pendingTransactions.length;
    blockChain.addTransaction(tx);
    expect(blockChain.pendingTransactions.includes(tx)).toBeTruthy();
    expect(ptt).toBe(blockChain.pendingTransactions.length - 1);
  });
  it("should not be able add invalid transaction - not signed", () => {
    const blockChain = new Blockchain();
    const tx = new Transaction(myWalletAddress, "a2", 10);
    const ptt = blockChain.pendingTransactions.length;
    expect(() => blockChain.addTransaction(tx)).toThrowError();
    expect(blockChain.pendingTransactions.includes(tx)).toBeFalsy();
  });
  it("should not be able add invalid transaction - invalid address", () => {
    const blockChain = new Blockchain();
    const tx = new Transaction("a1", null, 10);
    const ptt = blockChain.pendingTransactions.length;
    expect(() => blockChain.addTransaction(tx)).toThrowError();
    expect(blockChain.pendingTransactions.includes(tx)).toBeFalsy();
  });

  it("should be able to add new block", () => {
    const tx = new Transaction(myWalletAddress, "a2", 10);
    const previousHash = "";
    const timestamp = Date.now();
    tx.signTransaction(myKey);
    const transactions = [tx];
    const block = new Block(timestamp, transactions, previousHash);
    const blockChain = new Blockchain();
    blockChain.addBlock(block);
    expect(blockChain.chain.includes(block)).toBeTruthy();
  });

  it("should be able to mine pending transactions", () => {
    const tx = new Transaction(myWalletAddress, "a2", 10);
    const previousHash = "";
    const timestamp = Date.now();
    tx.signTransaction(myKey);
    const blockChain = new Blockchain();
    blockChain.addTransaction(tx);
    expect(() => blockChain.minePendingTransactions()).not.toThrowError();
  });

  it("should be able to compute if the chain is valid", () => {
    const tx = new Transaction(myWalletAddress, "a2", 10);
    const previousHash = "";
    const timestamp = Date.now();
    tx.signTransaction(myKey);
    const blockChain = new Blockchain();
    blockChain.addTransaction(tx);
    expect(() => blockChain.minePendingTransactions()).not.toThrowError();
    expect(blockChain.isChainValid()).toBeTruthy();
  });

  it("should return balance of provided address", () => {
    const tx = new Transaction(myWalletAddress, "a2", 10);
    const previousHash = "";
    const timestamp = Date.now();
    tx.signTransaction(myKey);
    const blockChain = new Blockchain();
    blockChain.addTransaction(tx);
    expect(() => blockChain.minePendingTransactions()).not.toThrowError();
    expect(blockChain.isChainValid()).toBeTruthy();
    expect(blockChain.getBalanceOfAddress(myWalletAddress)).toBe(-10);
  });
});
