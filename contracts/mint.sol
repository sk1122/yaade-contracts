pragma solidity ^0.8.0;

import "./Base64.sol";
import "./main.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFTMint is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    address contractAddress;
    NFTMarketplace nftMarketplace;

    constructor(address marketplaceAddress) ERC721("CalendarNFT", "SQUARE") {
        contractAddress = marketplaceAddress;
        nftMarketplace = NFTMarketplace(contractAddress);
    }

    event NFTUpdated(uint tokenID);

    function getTokenURI(string memory svg, string memory name, string memory desc) public pure returns (string memory finalJSON) {
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name":"', name, '", "description":"', desc, '", "image_data": "', bytes(svg), '"}'))));
        finalJSON = string(abi.encodePacked("data:application/json;base64,", json));
    }

    function changeURI(uint tokenId, string memory _text) public {
        require(ownerOf(tokenId) == msg.sender, "You not owner");

        string memory baseSVG = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: black; font-family: Inter; font-size: 14px; }</style><rect width='100%' height='100%' fill='white' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

        string memory svg = Base64.encode(bytes(string(abi.encodePacked(baseSVG, _text, '</text></svg>'))));
        string memory finalSVG = string(abi.encodePacked('data:image/svg+xml;base64,', svg));
        console.log("%s", finalSVG);
        string memory finalJSON = getTokenURI(finalSVG, _text, 'A NFT minted from yaadein.xyz');
        console.log("%s", finalJSON);

        _setTokenURI(tokenId, finalJSON);

        emit NFTUpdated(tokenId);
    }

    function checkNFT(string memory date, uint dayOfYear, string memory _tokenData) public payable {
        // msg.sender == date.highestBidder
        (address owner, uint minAmount, string memory date, bool sold, uint highestBidderId, uint tokenId) = nftMarketplace.listings(dayOfYear);
        (address bidder, string memory datE, uint bid, uint index) = nftMarketplace.bids(dayOfYear, highestBidderId);
        console.log("%s %d %d Bids", bidder, index, bid);
        require(msg.sender == bidder, "You are not highest bidder");

        console.log("Yeah Minted");
        mint(dayOfYear, _tokenData);
        console.log("Yeah Minted2");
    }

    function getTokenData(uint day) public view returns (string memory json, address owner) {
        json = tokenURI(day);
        owner = ownerOf(day);
    }

    function mint(uint day, string memory _tokenData) internal returns (uint) {
        uint id = day;
        _mint(msg.sender, id);
        _setTokenURI(id, _tokenData);
        console.log("%d %s", id, msg.sender);
        return id;
    }
}
