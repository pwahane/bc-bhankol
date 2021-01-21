const {Blockchain} = require("./Blockchain");
const {Transaction} = require("./Transaction");

const EC = require("elliptic").ec;

const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "189a07daf76ada77693f9cbd7590c0bba031128e871364f0553d0b9a54c4d8ec"
);

const myWalletAddress = myKey.getPublic("hex");

let chain = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "PK", 10);
tx1.signTransaction(myKey);
chain.addTransaction(tx1);

chain.minePendingTransactions(myWalletAddress);

console.log("Balance of address3", chain.getBalanceOfAddress(myWalletAddress));

chain.minePendingTransactions(myWalletAddress);

console.log("Balance of address3", chain.getBalanceOfAddress(myWalletAddress));
