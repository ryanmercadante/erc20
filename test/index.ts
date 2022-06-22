import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { ERC20 } from "../typechain";

describe("MyERC20Contract", () => {
  let myERC20Contract: ERC20;
  // eslint-disable-next-line no-unused-vars
  let deployer: SignerWithAddress;
  let someAddress: SignerWithAddress;
  let someOtherAddress: SignerWithAddress;

  beforeEach(async () => {
    const ERC20ContractFactory = await ethers.getContractFactory("ERC20");
    myERC20Contract = await ERC20ContractFactory.deploy("Merc Token", "MERC");
    await myERC20Contract.deployed();

    [deployer, someAddress, someOtherAddress] = await ethers.getSigners();
  });

  describe("When I have 10 tokens", () => {
    beforeEach(async () => {
      await myERC20Contract.transfer(someAddress.address, 10);
    });

    describe("When I transfer 10 tokens", () => {
      it("should transfer tokens correctly", async () => {
        await myERC20Contract
          .connect(someAddress)
          .transfer(someOtherAddress.address, 10);

        expect(
          await myERC20Contract.balanceOf(someOtherAddress.address)
        ).to.equal(10);
      });
    });

    describe("When I transfer 15 tokens", () => {
      it("should revert the transaction", async () => {
        await expect(
          myERC20Contract
            .connect(someAddress)
            .transfer(someOtherAddress.address, 15)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });
    });
  });
});
