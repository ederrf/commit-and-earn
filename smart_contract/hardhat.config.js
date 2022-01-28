//0xaf0c0dDe0a6906c4372cf965FcF9836817179F37

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/0Q_BZcmxqVdAJiZtE6srU6jF4oY-XzJ6',
      accounts: ['9691c38498a247ecbbd5202091707827b6409c68083f7cf7a027612c036c36ab']
    }
  }
};