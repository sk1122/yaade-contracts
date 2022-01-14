pragma solidity ^0.8.0;

import "./mint.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private listingId;
    
    struct TokenOffered {
        address owner;
        uint minAmount;
        address tokenContract;
        bool sold;
        uint highestBidderId;
        uint tokenId;
    }

    struct TokenBid {
        address bidder;
        address tokenContract;
        uint bid;
        uint index;
    }

    mapping(uint => TokenOffered) public listings;
    mapping(uint => TokenBid[]) public bids;

    event NewNFTListed(address owner, uint minAmount, address tokenContract, bool sold, uint highestBidderId);
    event RemoveNFTListed(uint _listingId);
    event UpdateNFTListed(address owner, uint minAmount, address tokenContract, bool sold, uint highestBidderId);
    event BidAdded(address bidder, uint _listingId, uint bid, uint index);
    event BidUpdated(address bidder, uint _listingId, uint bid, uint index);
    event BidRevoked(address bidder, uint _listingId, uint bid, uint index);
    event BidWinner(address bidder, uint _listingId, uint bid, uint index);

    function getLength(uint _listingId) view public returns(uint count) {
        return bids[_listingId].length;
    }

    function listNFT(uint minAmount, address tokenContract, uint tokenId) public payable returns (uint) {
        require(minAmount >= 1, "Amount should atleast be 1 wei");
        uint id = listingId.current();

        TokenOffered memory listing = TokenOffered(msg.sender, minAmount, tokenContract, false, 0, tokenId);
        listings[id] = listing;
        emit NewNFTListed(msg.sender, minAmount, tokenContract, listing.sold, 0);

        return id;
    }

    function removeNFT(uint _listingId) public returns (bool) {
        require(listings[_listingId].tokenContract != address(0), "Listing Doesn't Exist");
        require(listings[_listingId].owner == msg.sender, "You not owner then why sending this shit");

        delete listings[_listingId];
        emit RemoveNFTListed(_listingId);

        return true;
    }

    function updateNFT(uint _listingId, uint minAmount, bool _sold) public returns (bool) {
        require(listings[_listingId].tokenContract != address(0), "Listing Doesn't Exist");
        require(listings[_listingId].owner == msg.sender, "You not owner then why sending this shit");

        listings[_listingId].minAmount = minAmount;
        listings[_listingId].sold = _sold;
        emit UpdateNFTListed(listings[_listingId].owner, listings[_listingId].minAmount, listings[_listingId].tokenContract, listings[_listingId].sold, listings[_listingId].highestBidderId);

        return true;
    }

    function findBid(uint _listingId, address owner) internal view returns (uint, bool) {
        TokenBid[] memory _bids = bids[_listingId];
        for(uint i=0;i<_bids.length;i++) {
            if(_bids[i].bidder == owner) return (i, true);
        }

        return (0, false);
    } 

    function addBid(uint _listingId, uint bid) public payable {
        require(msg.value == bid, "Send same amount of ether to me");
        require(listings[_listingId].tokenContract != address(0), "Listing Dosen't Exist");
        require(listings[_listingId].owner != msg.sender, "You not owner then why sending this shit");
        require(listings[_listingId].minAmount < msg.value, "Send some more");

        uint length;
        if(bids[_listingId].length == 0) length = 0;
        else length = bids[_listingId].length - 1;

        TokenBid memory tokenBid = TokenBid(msg.sender, listings[_listingId].tokenContract, bid, length);
        bids[_listingId].push(tokenBid);
        emit BidAdded(msg.sender, _listingId, bid, tokenBid.index);
    }

    function updateBid(uint _listingId, uint bidAmount) public payable {
        uint _bid;
        bool found;
        (_bid, found) = findBid(_listingId, address(msg.sender));
        require(found, "Bid not found");
        TokenBid storage tokenBid = bids[_listingId][_bid];
        require(msg.sender == tokenBid.bidder, "You are not the bidder");

        tokenBid.bid = bidAmount;

        emit BidUpdated(tokenBid.bidder, _listingId, _bid, _bid);
    }

    function deleteBid(uint _listingId) public {
        uint _bid;
        bool found;
        (_bid, found) = findBid(_listingId, address(msg.sender));
        require(found, "Bid not found");
        TokenBid storage tokenBid = bids[_listingId][_bid];
        require(msg.sender == tokenBid.bidder, "You are not the bidder");

        delete bids[_listingId][_bid];

        require(tokenBid.bid < address(this).balance, "Balance is lower");
        payable(msg.sender).transfer(tokenBid.bid);

        emit BidRevoked(tokenBid.bidder, _listingId, tokenBid.bid, _bid);
    }

    function getHighestBid(uint _listingId) public returns (TokenBid memory) {
        TokenBid[] memory bidList = bids[_listingId];
        TokenBid memory highestBid;

        for(uint i=0;i<bidList.length;i++) {
            if(bidList[i].bid > highestBid.bid) {
                highestBid = bidList[i];
            }
        }
        
        TokenOffered storage offered = listings[_listingId];
        offered.highestBidderId = highestBid.index;

        return highestBid;
    }

    function declareWinner(uint _listingId, uint bidId) public {
        require(bidId == listings[_listingId].highestBidderId, "msg.sender is not highest bidder");

        TokenBid memory bid = bids[_listingId][bidId];

        IERC721(bid.tokenContract).safeTransferFrom(address(this), bid.bidder, listings[_listingId].tokenId);

        emit BidWinner(bid.bidder, _listingId, bid.bid, bidId);
    }
}
