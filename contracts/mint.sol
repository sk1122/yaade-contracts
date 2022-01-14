pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract NFTMint is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("CalendarNFT", "SQUARE") {
        contractAddress = marketplaceAddress;
    }

    function mint(string memory _tokenData) public returns (uint) {
        uint id = _tokenId.current();
        _mint(msg.sender, id);
        _setTokenURI(id, _tokenData);
        setApprovalForAll(contractAddress, true);
        _tokenId.increment();
        return id;
    }
}
