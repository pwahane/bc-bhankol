const { expect } = require("@jest/globals");
const { Transaction } = require("../Transaction");
const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;

const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "189a07daf76ada77693f9cbd7590c0bba031128e871364f0553d0b9a54c4d8ec"
);

const myWalletAddress = myKey.getPublic("hex");

describe("Transactions", () => {
  test("should be able to calculate hash of transaction correctly", () => {
    const tx = new Transaction("a1", "a2", 10);
    expect(tx.calculateHash()).toBe(SHA256("a1" + "a2" + 10).toString());
  });

  test("should be able to sign a transaction", () => {
    const tx = new Transaction(myWalletAddress, "a2", 10);
    tx.signTransaction(myKey);
    expect(tx.signature).toBeTruthy();
  });

  test("should be able to validate transaction", () => {
    const tx = new Transaction(myWalletAddress, "a2", 10);
    tx.signTransaction(myKey);
    expect(tx.isValid()).toBeTruthy();
  });

  test("should not be able to sign transaction with invalid key", () => {
    const tx = new Transaction("a1", "a2", 10);
    expect(() => tx.signTransaction(myKey)).toThrow(Error);
  });

  test("should validate a mining reward transaction", () => {
    const tx = new Transaction(null, "a2", 10);
    expect(tx.isValid()).toBeTruthy();
  });

  test("should throw error when transaction is not signed", () => {
    const tx = new Transaction("a1", "a2", 10);
    expect(() => tx.isValid()).toThrowError();
  });
});
