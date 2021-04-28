const { networkInterfaces } = require("os");
const ipInt = require("ip-to-int");

/**
 * This function gets the local ipv4 address of the client.
 * Code is taken from https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
 * @returns the ip address as a string
 */
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

/**
 * This function generates a session code based on the clients local ip-address and two 2-digit numbers padded at the start and end of the number, then turned to base36.
 * The reason for using ip address is so that the backend (if on the same local network or on same vpn) can connect and start sending data to the frontend by decoding the session code.
 * The random numbers are just to have some randomness so that the same code won't be generated twice and it won't be super easy to connect without a proper code (however it is not supposed to be cryptographically secure at all).
 * See the tokendecode.py in the backend for details of how to decode the session code.
 * @returns a session code as a string
 */
function generateCode() {
  let ipNum = ipInt(getIPv4()).toInt();
  let startCode = Math.floor(10 + Math.random() * 89).toString();
  let endCode = Math.floor(10 + Math.random() * 89).toString();

  return parseInt(startCode + ipNum + endCode).toString(36);
}

/**
 * Generate test codes.
 * @param {Number} amount - is the amount of codes that are generated for tests
 */
function generateTestCodes(amount) {
  for (let i = 0; i < amount; i++) {
    console.log(generateCode());
  }
}

// Uncomment this to generate 1000 codes that can be used in the backend for test cases.
// generateTestCodes(1000);

module.exports = {
  generateCode: generateCode,
};
