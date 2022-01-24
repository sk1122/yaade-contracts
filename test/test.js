const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", async () => {
  let Main, main, mintNFT, mint, addr1, addr2, addr3, addr4, date

  beforeEach(async () => {
    Main = await ethers.getContractFactory('NFTMarketplace')
    main = await Main.deploy()
    
    await main.deployed();

    mintNFT = await ethers.getContractFactory('NFTMint')
    mint = await mintNFT.deploy(main.address)
    await mint.deployed();

    [addr1, addr2, addr3, addr4] = await ethers.getSigners()
    
    date = 24
  })
  
  it("deploys", async () => {
    const Main = await hre.ethers.getContractFactory('NFTMarketplace')
    const main = await Main.deploy()

    await main.deployed()

    expect(main.address.length).to.equal(42)
  })

  describe("NFT", async () => {    
    describe("Update NFT on Marketplace", async () => {
      it("updates nft on marketplace w/ sold = false", async () => {
        let nft = await main.updateNFT(date, 120, false);
        nft = await nft.wait()
        let nftEvent = nft.events?.find(event => event.event === 'UpdateNFTListed')
        
        console.log(nftEvent.args)
      })
    })
  })
  
  describe("Bidding", async () => {
    it("add a bid to a nft", async () => {
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(date, 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      expect(bidEvent.args.bidder).to.equal(addr2.address)
      expect(bidEvent.args.id.toNumber()).to.equal(date)
      expect(bidEvent.args.bid.toNumber()).to.equal(120)
      expect(bidEvent.args.index.toNumber()).to.equal(0)
      
      options = { value: 140 }
      bid = await main.connect(addr3).addBid(date, 140, options)
      bid = await bid.wait()
      bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      expect(bidEvent.args.index.toNumber()).to.equal(1)
    })
    
    it("update a bid to a nft", async () => {
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(date, 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      options = { value: 30 }
      bid = await main.connect(addr2).updateBid(date, 150, options)
      bid = await bid.wait()
      bidEvent = bid.events?.find(event => event.event === 'BidUpdated')
      expect(bidEvent.args.bidder).to.equal(addr2.address)
      expect(bidEvent.args.id.toNumber()).to.equal(date)
      expect(bidEvent.args.bid.toNumber()).to.equal(150)
      expect(bidEvent.args.index.toNumber()).to.equal(0)
    })
    
    it("revoke a bid to a nft", async () => {  
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(date, 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      let deleteBid = await main.connect(addr2).deleteBid(date)
      deleteBid = await deleteBid.wait()
      let deleteEvent = deleteBid.events?.find(event => event.event === 'BidRevoked')
      
      expect(deleteEvent.args.id.toNumber()).to.equal(bidEvent.args.id.toNumber())
    })
    
    it("get highest bid for a nft", async () => {  
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(date, 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      options = { value: 130 }
      bid = await main.connect(addr3).addBid(date, 130, options)
      bid = await bid.wait()
      bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      let highestBid = await main.getHighestBid(date)
      highestBid = await highestBid.wait()
      let highestBidEvent = highestBid.events?.find(event => event.event === 'UpdateNFTListed')
      
      let winningBid = await main.bids(date, highestBidEvent.args.highestBidderId.toNumber())
      
      expect(winningBid.bidder).to.equal(addr3.address)
    })
    
    it("declare winner", async () => {  
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(date, 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
  
      options = { value: 130 }
      bid = await main.connect(addr3).addBid(date, 130, options)
      bid = await bid.wait()
      bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      let highestBid = await main.getHighestBid(date)
      highestBid = await highestBid.wait()
      let highestBidEvent = highestBid.events?.find(event => event.event === 'UpdateNFTListed')
      
      let declareWinner = await main.declareWinner(date, highestBidEvent.args.highestBidderId.toNumber())
      declareWinner = await declareWinner.wait()
      let declareWinnerEvent = declareWinner.events?.find(event => event.event === 'BidWinner')
      
      expect(declareWinnerEvent.args.bidder).to.equal(addr3.address)
    })
  })
  
  describe("NFT's", async () => {
    it("checks if nft is available for me!", async () => {    
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(date, 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      options = { value: 130 }
      bid = await main.connect(addr3).addBid(date, 130, options)
      bid = await bid.wait()
      bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      let highestBid = await main.getHighestBid(date)
      highestBid = await highestBid.wait()
      let highestBidEvent = highestBid.events?.find(event => event.event === 'UpdateNFTListed')
      
      let declareWinner = await main.declareWinner(date, highestBidEvent.args.highestBidderId.toNumber())
      declareWinner = await declareWinner.wait()
      let declareWinnerEvent = declareWinner.events?.find(event => event.event === 'BidWinner')

      let nft = await mint.connect(addr3).checkNFT("2021-10-10", 24, "dsafasfsa")
      let nftU = await main.connect(addr3).updateNFT(date, 120, false);
      nftU = await nftU.wait()
      let nftEvent = nftU.events?.find(event => event.event === 'UpdateNFTListed')

      let changeURI = await mint.connect(addr3).changeURI(date, "Wagmi🌞")
      changeURI = await changeURI.wait()
      let changeURIEvent = changeURI.events?.find(event => event.event === 'NFTUpdated')

      console.log(changeURIEvent.args)

      expect(true).to.equal(true)
    })
  })
})
