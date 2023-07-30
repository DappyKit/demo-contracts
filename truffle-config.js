const { GSNDevProvider } = require('@opengsn/provider')

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // match any network id
    }
  },
  // rest of the config
  compilers: {
    solc: {
      version: "0.8.6"
      // settings: { evmVersion: 'london' }
    }
  },
  solidityLog: {
    displayPrefix: ' :', // defaults to ""
    preventConsoleLogMigration: true // defaults to false
  }
}
