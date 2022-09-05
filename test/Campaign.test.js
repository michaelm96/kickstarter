const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: (10 ** 6).toString() });

  await factory.methods.createCampaign((10 ** 2).toString()).send({
    from: accounts[0],
    gas: (10 ** 6).toString(),
  });

  // [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  const addresses = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = addresses[0];

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("make sure factory and campaign have addresses", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("make sure the caller is the campaign manager", async () => {
    assert.equal(accounts[0], await campaign.methods.manager().call());
  });

  it("allow people to contribute money and mark them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: (10 ** 2).toString(),
      from: accounts[1],
      gas: (10 ** 6).toString(),
    });

    const approversList = await campaign.methods.approvers(accounts[1]).call();

    assert(approversList);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: (10 ** 1).toString(),
        from: accounts[2],
        gas: (10 ** 6).toString(),
      });

      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows manager to make a payment request", async () => {
    try {
      await campaign.methods
        .createRequest("buy batteries", 123456789, accounts[2])
        .send({
          from: accounts[0],
          gas: (10 ** 6).toString(),
        });

      const theRequest = await campaign.methods.requests([0]).call();
      assert.equal(theRequest.description, "buy batteries");
      assert.equal(theRequest.value, 123456789);
      assert.equal(theRequest.recipient, accounts[2]);
      assert.equal(theRequest.complete, false);
      assert.equal(theRequest.approvalCount, 0);
    } catch (error) {
      console.log(error, "@85");
      assert(false);
    }
  });

  it("process request", async () => {
    try {
      const camMet = campaign.methods;
      const recipientBalanceBefore = await web3.eth.getBalance(accounts[3]);


      await camMet.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei("0.01", "ether"),
      });

      await camMet
        .createRequest("A", web3.utils.toWei("0.001", "ether"), accounts[3])
        .send({
          from: accounts[0],
          gas: (10 ** 6).toString(),
        });

      await camMet.approveRequest(0).send({
        from: accounts[0],
        gas: (10 ** 6).toString(),
      });

      await camMet.finalizeRequest(0).send({
        from: accounts[0],
        gas: (10 ** 6).toString(),
      });

      const recipientBalanceAfter = await web3.eth.getBalance(accounts[3]);

      if (
        recipientBalanceAfter - recipientBalanceBefore >=
        web3.utils.toWei("0.0009", "ether")
      ) {
        assert(true);
      } else {
        assert(false);
      }
    } catch (error) {
      console.log(error, "@ERR");
      assert(false);
    }
  });
});
