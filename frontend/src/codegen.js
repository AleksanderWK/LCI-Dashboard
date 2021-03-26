const { networkInterfaces } = require("os");
const ipInt = require("ip-to-int");

function getIPv4() {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        return net.address;
      }
    }
  }
  return results;
}

function generateCode() {
  let ipNum = ipInt(getIPv4()).toInt();
  let startCode = Math.floor(10 + Math.random() * 89).toString();
  let endCode = Math.floor(10 + Math.random() * 89).toString();

  return parseInt(startCode + ipNum + endCode).toString(36);
}

function generateTestCodes(amount) {
  for (let i = 0; i < amount; i++) {
    console.log(generateCode());
  }
}

generateTestCodes(1000);

module.exports = {
  generateCode: generateCode,
};
