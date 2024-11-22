const CSToken = artifacts.require("CSToken");
const InsuranceCompany = artifacts.require("InsuranceCompany");
const Marketplace = artifacts.require("Marketplace");

module.exports = function (deployer, network, accounts) {
    deployer
        .deploy(CSToken)
        .then(function () {
            return deployer.deploy(InsuranceCompany, CSToken.address);
        })
        .then(function () {
            return deployer.deploy(
                Marketplace,
                CSToken.address,
                InsuranceCompany.address
            );
        });
};
