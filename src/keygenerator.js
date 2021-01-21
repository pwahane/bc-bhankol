const EC = require("elliptic").ec;

const ec = new EC("secp256k1");

const generateKeyPair = () => {
  const key = ec.genKeyPair();
  return { publicKey: key.getPublic("hex"), privateKey: key.getPrivate("hex") };
};

module.exports.generateKeyPair = generateKeyPair;