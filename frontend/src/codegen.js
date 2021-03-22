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
  let startCode = (1 + Math.random() * 99).toFixed(0).toString();
  let endCode = (Math.random() * 100).toFixed(0).toString();

  return parseInt(startCode + ipNum + endCode).toString(36);
}

module.exports = {
  generateCode: generateCode,
};
