pragma solidity ^0.8.0;

// import "./mint.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

library Types {
    struct TokenOffered {
        address owner;
        uint minAmount;
        string date;
        bool sold;
        uint highestBidderId;
        uint tokenId;
    }

    struct TokenBid {
        address bidder;
        string date;
        uint bid;
        uint index;
    }
}

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private listingId;

    mapping(uint => Types.TokenOffered) public listings;
    mapping(uint => Types.TokenBid[]) public bids;

    event NewNFTListed(uint id, address owner, uint minAmount, string date, bool sold, uint highestBidderId);
    event RemoveNFTListed(uint id);
    event UpdateNFTListed(address owner, uint minAmount, string date, bool sold, uint highestBidderId);
    event BidAdded(address bidder, uint id, uint bid, uint index);
    event BidUpdated(address bidder, uint id, uint bid, uint index);
    event BidRevoked(address bidder, uint id, uint bid, uint index);
    event BidWinner(address bidder, uint id, uint bid, uint index);

    function getLength(uint _listingId) view public returns(uint count) {
        return bids[_listingId].length;
    }

    function getBids(uint _listingId) public view returns (Types.TokenBid[] memory) {
        return bids[_listingId];
    }

    function getNFT(uint _listingId) public view returns(Types.TokenOffered memory) {
        return listings[_listingId];
    }

    function createListing(uint day, string memory date, uint minAmount) public {
        Types.TokenOffered memory token_offered = listings[day];

        token_offered.date = date;
        token_offered.minAmount = minAmount;
        token_offered.owner = msg.sender;
        token_offered.sold = false;
        token_offered.highestBidderId = 0;

        listings[day] = token_offered;

        emit NewNFTListed(day, token_offered.owner, token_offered.minAmount, token_offered.date, token_offered.sold, token_offered.highestBidderId);
    }

    function updateNFT(uint _listingId, uint minAmount, bool _sold) public returns (bool) {
        // require(listings[_listingId].tokenContract != address(0), "Listing Doesn't Exist");
        console.log("Update NFT %s %s", msg.sender, listings[_listingId].owner);
        require(listings[_listingId].owner == msg.sender, "You not owner then why sending this shit");

        listings[_listingId].minAmount = minAmount;
        listings[_listingId].sold = _sold;
        emit UpdateNFTListed(listings[_listingId].owner, listings[_listingId].minAmount, listings[_listingId].date, listings[_listingId].sold, listings[_listingId].highestBidderId);

        return true;
    }

    function getBid(uint _listingId, uint bidId) public view returns (Types.TokenBid memory bid) {
        bid = bids[_listingId][bidId];
    }

    function findBid(uint _listingId, address owner) public view returns (uint bidId, bool found) {
        Types.TokenBid[] memory _bids = bids[_listingId];

        for(uint i=0;i<_bids.length;i++) {
            if(_bids[i].bidder == owner) return (i, true);
        }

        bidId = 0;
        found = false;
    } 

    function addBid(uint _listingId, uint bid) public payable {
        require(msg.value == bid, "Send same amount of ether to me");
        // require(listings[_listingId].tokenContract != address(0), "Listing Dosen't Exist");
        require(!listings[_listingId].sold, "Already Sold");
        require(listings[_listingId].owner != msg.sender, "You not owner then why sending this shit");
        require(listings[_listingId].minAmount < msg.value, "Send some more");

        uint length;
        if(bids[_listingId].length == 0) length = 0;
        else length = bids[_listingId].length;

        console.log("%d", length);

        Types.TokenBid memory tokenBid = Types.TokenBid(msg.sender, listings[_listingId].date, bid, length);
        bids[_listingId].push(tokenBid);
        emit BidAdded(msg.sender, _listingId, bid, tokenBid.index);
    }

    function updateBid(uint _listingId, uint bidAmount) public payable {
        uint _bid;
        bool found;
        (_bid, found) = findBid(_listingId, address(msg.sender));
        require(found, "Bid not found");
        Types.TokenBid storage tokenBid = bids[_listingId][_bid];
        require(bidAmount > tokenBid.bid, "Bid should be greater than previous bid");
        require(bidAmount - tokenBid.bid == msg.value, "Send Exact Difference of Amount");
        require(msg.sender == tokenBid.bidder, "You are not the bidder");

        console.log('%d %s', tokenBid.bid, tokenBid.bidder);

        tokenBid.bid = bidAmount;

        emit BidUpdated(tokenBid.bidder, _listingId, tokenBid.bid, tokenBid.index);
    }

    function deleteBid(uint _listingId) public {
        uint _bid;
        bool found;
        (_bid, found) = findBid(_listingId, address(msg.sender));
        require(found, "Bid not found");
        Types.TokenBid storage tokenBid = bids[_listingId][_bid];
        require(msg.sender == tokenBid.bidder, "You are not the bidder");

        console.log("%d %d", address(this).balance, tokenBid.bid);
        require(tokenBid.bid <= address(this).balance, "Balance is lower");
        
        payable(msg.sender).transfer(tokenBid.bid);
        console.log("Not Problem");
        // require(sent, "Transaction not sent");

        delete bids[_listingId][_bid];
        emit BidRevoked(tokenBid.bidder, _listingId, tokenBid.bid, _bid);
    }

    function getHighestBid(uint _listingId) public {
        Types.TokenBid[] memory bidList = bids[_listingId];
        Types.TokenBid memory highestBid;

        for(uint i=0;i<bidList.length;i++) {
            console.log("%s %d bids", bidList[i].bidder, bidList[i].bid);
            console.log("%s %d bidsssss", highestBid.bidder, highestBid.bid);
            if(bidList[i].bid > highestBid.bid) {
                highestBid = bidList[i];
            }
        }
        
        console.log("%s %d last", highestBid.bidder, highestBid.bid);
        Types.TokenOffered storage offered = listings[_listingId];
        offered.highestBidderId = highestBid.index;

        declareWinner(_listingId, highestBid.index);

        emit UpdateNFTListed(offered.owner, offered.minAmount, offered.date, offered.sold, offered.highestBidderId);
    }

    function getHighestBidReturn(uint _listingId) public view returns(Types.TokenBid memory bid) {
        Types.TokenBid[] memory bidList = bids[_listingId];
        Types.TokenBid memory highestBid;

        for(uint i=0;i<bidList.length;i++) {
            console.log("%s %d bids", bidList[i].bidder, bidList[i].bid);
            console.log("%s %d bidsssss", highestBid.bidder, highestBid.bid);
            if(bidList[i].bid > highestBid.bid) {
                highestBid = bidList[i];
            }
        }
        
        bid = highestBid;
    }

    function declareWinner(uint _listingId, uint bidId) internal {
        Types.TokenBid memory bid = bids[_listingId][bidId];

        listings[_listingId].sold = true;
        listings[_listingId].owner = bid.bidder;

        for(uint i=0;i<bids[_listingId].length;i++) {
            if(bids[_listingId][i].bidder != bid.bidder) {
                payable(bids[_listingId][i].bidder).transfer(bids[_listingId][i].bid);
            }
        }

        // IERC721(bid.tokenContract).safeTransferFrom(address(this), bid.bidder, listings[_listingId].tokenId);

        emit BidWinner(bid.bidder, _listingId, bid.bid, bidId);
    }
}
