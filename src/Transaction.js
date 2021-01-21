const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress)
      throw new Error("You can't sign this transaction. Invalid Key.");
    const hashTx = this.calculateHash();
    const sign = signingKey.sign(hashTx, "base64");
    this.signature = sign.toDER("hex");
  }

  isValid() {
    if (!this.signature || this.signature.length === 0)
      throw new Error("No Signature.");
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

module.exports.Transaction = Transaction;