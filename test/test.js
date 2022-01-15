const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", async () => {
  let Main, main, addr1, addr2, addr3, addr4

  beforeEach(async () => {
    Main = await ethers.getContractFactory('NFTMarketplace')
    main = await Main.deploy()
  
    await main.deployed();

    [addr1, addr2, addr3, addr4] = await ethers.getSigners()
  })
  
  it("deploys", async () => {
    const Main = await hre.ethers.getContractFactory('NFTMarketplace')
    const main = await Main.deploy()

    await main.deployed()

    expect(main.address.length).to.equal(42)
  })

  describe("NFT", async () => {
    it("lists nft on marketplace", async () => {
      let listNFT = await main.listNFT(120, addr1.address, 0);
      listNFT = await listNFT.wait()
      const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')
      
      expect(listEvent.args.owner.length).to.equal(42)
      expect(listEvent.args.minAmount.toNumber()).to.equal(120)
      expect(listEvent.args.tokenContract.length).to.equal(42)
      expect(listEvent.args.sold).to.equal(false)
      expect(listEvent.args.highestBidderId.toNumber()).to.equal(0)
    })
    
    describe("Update NFT on Marketplace", async () => {
      it("updates nft on marketplace w/ sold = false", async () => {
        let listNFT = await main.listNFT(120, addr1.address, 0);
        listNFT = await listNFT.wait()
        const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')
        
        let updateNFT = await main.updateNFT(listEvent.args.id.toNumber(), 130, false)
        updateNFT = await updateNFT.wait()
        let updateEvent = updateNFT.events?.find(event => event.event === 'UpdateNFTListed')
        
        expect(updateEvent.args.owner.length).to.equal(42)
        expect(updateEvent.args.minAmount.toNumber()).to.equal(130)
        expect(updateEvent.args.tokenContract.length).to.equal(42)
        expect(updateEvent.args.sold).to.equal(false)
        expect(updateEvent.args.highestBidderId.toNumber()).to.equal(0)  
      })
      
      it("updates NFT on marketplace w/ sold = true", async () => {
        let listNFT = await main.listNFT(120, addr1.address, 0);
        listNFT = await listNFT.wait()
        const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')
        
        let updateNFT = await main.updateNFT(listEvent.args.id.toNumber(), 130, true)
        updateNFT = await updateNFT.wait()
        let updateEvent = updateNFT.events?.find(event => event.event === 'UpdateNFTListed')
        expect(updateEvent.args.sold).to.equal(true)
      })
    })
    
    it("revoke NFT from marketplace", async () => {
      let listNFT = await main.listNFT(120, addr1.address, 0);
      listNFT = await listNFT.wait()
      const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')

      let revokeNFT = await main.removeNFT(listEvent.args.id.toNumber())
      revokeNFT = await revokeNFT.wait()
      const revokeNFTEvent = revokeNFT.events?.find(event => event.event === 'RemoveNFTListed')
      
      expect(revokeNFTEvent.args.id.toNumber()).to.equal(listEvent.args.id.toNumber())
    })
  })

  describe("Bidding", async () => {
    it("add a bid to a nft", async () => {
      let listNFT = await main.listNFT(100, addr1.address, 0);
      listNFT = await listNFT.wait()
      const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')

      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(listEvent.args.id.toNumber(), 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      expect(bidEvent.args.bidder).to.equal(addr2.address)
      expect(bidEvent.args.id.toNumber()).to.equal(listEvent.args.id.toNumber())
      expect(bidEvent.args.bid.toNumber()).to.equal(120)
      expect(bidEvent.args.index.toNumber()).to.equal(0)
      
      options = { value: 140 }
      bid = await main.connect(addr3).addBid(listEvent.args.id.toNumber(), 140, options)
      bid = await bid.wait()
      bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      expect(bidEvent.args.index.toNumber()).to.equal(1)
    })
    
    it("update a bid to a nft", async () => {
      let listNFT = await main.listNFT(100, addr1.address, 0);
      listNFT = await listNFT.wait()
      const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')
  
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(listEvent.args.id.toNumber(), 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      options = { value: 30 }
      bid = await main.connect(addr2).updateBid(listEvent.args.id.toNumber(), 150, options)
      bid = await bid.wait()
      bidEvent = bid.events?.find(event => event.event === 'BidUpdated')
      expect(bidEvent.args.bidder).to.equal(addr2.address)
      expect(bidEvent.args.id.toNumber()).to.equal(listEvent.args.id.toNumber())
      expect(bidEvent.args.bid.toNumber()).to.equal(150)
      expect(bidEvent.args.index.toNumber()).to.equal(0)
    })
    
    it("revoke a bid to a nft", async () => {
      let listNFT = await main.listNFT(100, addr1.address, 0);
      listNFT = await listNFT.wait()
      const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')
  
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(listEvent.args.id.toNumber(), 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      let deleteBid = await main.connect(addr2).deleteBid(listEvent.args.id.toNumber())
      deleteBid = await deleteBid.wait()
      let deleteEvent = deleteBid.events?.find(event => event.event === 'BidRevoked')
      
      expect(deleteEvent.args.id.toNumber()).to.equal(bidEvent.args.id.toNumber())
    })

    it("get highest bid for a nft", async () => {
      let listNFT = await main.listNFT(100, addr1.address, 0);
      listNFT = await listNFT.wait()
      const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')
  
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(listEvent.args.id.toNumber(), 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
  
      options = { value: 130 }
      bid = await main.connect(addr3).addBid(listEvent.args.id.toNumber(), 130, options)
      bid = await bid.wait()
      bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      let highestBid = await main.getHighestBid(listEvent.args.id.toNumber())
      highestBid = await highestBid.wait()
      let highestBidEvent = highestBid.events?.find(event => event.event === 'UpdateNFTListed')
      
      let winningBid = await main.bids(listEvent.args.id.toNumber(), highestBidEvent.args.highestBidderId.toNumber())
      
      expect(winningBid.bidder).to.equal(addr3.address)
    })
    
    it("declare winner", async () => {
      let listNFT = await main.listNFT(100, addr1.address, 0);
      listNFT = await listNFT.wait()
      const listEvent = listNFT.events?.find(event => event.event === 'NewNFTListed')
  
      let options = { value: 120 }
      let bid = await main.connect(addr2).addBid(listEvent.args.id.toNumber(), 120, options)
      bid = await bid.wait()
      let bidEvent = bid.events?.find(event => event.event === 'BidAdded')
  
      options = { value: 130 }
      bid = await main.connect(addr3).addBid(listEvent.args.id.toNumber(), 130, options)
      bid = await bid.wait()
      bidEvent = bid.events?.find(event => event.event === 'BidAdded')
      
      let highestBid = await main.getHighestBid(listEvent.args.id.toNumber())
      highestBid = await highestBid.wait()
      let highestBidEvent = highestBid.events?.find(event => event.event === 'UpdateNFTListed')
      
      let declareWinner = await main.declareWinner(listEvent.args.id.toNumber(), highestBidEvent.args.highestBidderId.toNumber())
      declareWinner = await declareWinner.wait()
      let declareWinnerEvent = declareWinner.events?.find(event => event.event === 'BidWinner')

      expect(declareWinnerEvent.args.bidder).to.equal(addr3.address)
    })
  })
})
