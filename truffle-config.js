module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // match any network id
    }
  },
  // rest of the config
  compilers: {
    solc: {
      version: "0.8.19",
      settings: { evmVersion: 'london' }
    }
  }
}
