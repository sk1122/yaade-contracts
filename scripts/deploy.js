// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  let [addr1, addr2, addr3, addr4] = await hre.ethers.getSigners()

  // We get the contract to deploy
  const Main = await hre.ethers.getContractFactory('NFTMarketplace')
  const main = await Main.deploy()

  await main.deployed()

  console.log(main.address)

  let listNFT = await main.listNFT(120, addr1.address, 0);
  listNFT = await listNFT.wait()
  
  const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')
  console.log(listEvent)

  let options = { value: 130 }
  let bidOnNFT = await main.connect(addr2).addBid(listEvent.args.id.toNumber(), 130, options)
  bidOnNFT = await bidOnNFT.wait()

  options = { value: 140 }
  bidOnNFT = await main.connect(addr3).addBid(listEvent.args.id.toNumber(), 140, options)
  bidOnNFTT = await bidOnNFT.wait()

  options = { value: 160 }
  bidOnNFT = await main.connect(addr4).addBid(listEvent.args.id.toNumber(), 160, options)
  bidOnNFTT = await bidOnNFT.wait()
  
  const bidEvent = bidOnNFT.events?.find(event => event.event === 'BidAdded')
  const bidEventt = bidOnNFTT.events?.find(event => event.event === 'BidAdded')
  
  let highestBid = await main.getHighestBid(listEvent.args.id.toNumber())
  highestBid = await highestBid.wait()
  const highestBidEvent = highestBid.events?.find(event => event.event === 'UpdateNFTListed')
  console.log("Highest Bid", highestBidEvent.args.highestBidderId.toNumber())

  console.log(listEvent, bidEvent, bidEventt)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
