////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
//                                                                                                            //
//                            ┴┴┴┴┴┴┴┘        "┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴`        "┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴                   //
//                        ▐▒▒▓▓▓▓▓▓▓▓▌     ╠▒╠▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▀╠╠░  ╠▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌╠╠                //
//                     ╠▄▄▄▄▓▓▓▓▓▓▓▓▓▌     ╠▄▓▓▓▓▓▓▀▀▀▀▀▀▀▀▀▓▓▓▓▄▓▓▌ ▐▄▓▓▓▓▓▓▓▀▀▀▀▀▀▀▀▓▓▓▓▓▄▄▓                //
//                 ,▄▄▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌    ╙▓▓▓▓▓▓▓▓▀┴┴┴┴┴┴┴▀▓▓▓▓▓▓▓▄ ║▓▓▓▓▓▓▓▓┴┴┴┴┴┴┴┴▓▓▓▓▓▓▓▓▄               //
//              ╓▄▄▄▄▄▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄,,╓ ╙▓▓▓▓▓▓▓▓░"""""""▀▓▓▓▓▓▓▓▄ ▀▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╕               //
//              ╟▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓███ `▓▓▓▓▓▓▓▓        ╠▓▓▓▓▓▓▓█    `▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓m               //
//              ╟▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ,▓▓▓▓▓▓▓▓        ║▓▓▓▓▓▓▓█    ,,,,,,,,,,,,,,▓▓▓▓▓▓▓▓∩               //
//             ╓▄▄▄▄▄▄▄▄▄▄▄▄▄▄▓▓▓▓▓▓▓▓▄▄  ▄▓▓▓▓▓▓▓▀        ▄▓▓▓▓▓▓▓▀    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▓▓▓▓▓▓▓▓┘               //
//             .--╓╓╓╓╓╓╓╓╓-4▄▓▓▓▓▓▓▓▓╓,  ▄▓▓▓▓▓▓▓▓"¬¬¬¬¬¬╔▓▓▓▓▓▓▓▓▀      ¬  ¬    9▓▀▓▓▓▓▓▓▓▓▓┘               //
//                           ╣▓▓▓▓▓▓▓▌    #███▓▓▓▓▓▀▀▀▀▀▀▀▓▓▓▓▓▓▓██▀     ▀▀▀▀▀▀▀▀▀▓▓▓▓▓▓███+-                 //
//                           ██▀▀▀▀█▀     *~!^█▀▀▀▀▀▀▀▀▀▀▀▀█████▀0≈     ⁿ▀▀▀▀▀▀▀▀▀▀▀█▀▀▀ªªº=%                 //
//                           ┴"┴┴┴┴┴`     ╙┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴^     "┴┴┴┴┴┴┴┴┴""""┴┴┴┘                    //
//                           """""""         `"""""""""""""""""                `"""""""""                     //
//                                                                                                            //
//                                                                             cuatroceronueve                //
//                                                                                                            //
//                                                                                                            //
//                                                                                                            //
//                                                                                                            //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Mint409 is ERC721URIStorage, Ownable, ReentrancyGuard{
    string private _collectionURI;
    string public baseURI;
    uint256 immutable public maxSupply = 409;
    uint256 public tokenCount = 0;    
    bytes32 public whitelistMerkleRoot;
    
    mapping(address => bool) public claimed;
    mapping(address => uint256) public tokenAvatar;    

    event newTokenMinted(address indexed owner, uint256 id); 

    constructor(string memory _baseURI, string memory collectionURI) ERC721("409 AMIGOS", "AMIGO") {
        setBaseURI(_baseURI);
        setCollectionURI(collectionURI);        
    }
    
    modifier isValidMerkleProof(bytes32[] calldata merkleProof, bytes32 root) {
        require(
            MerkleProof.verify(
                merkleProof,
                root,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "Address does not exist in whitelist"
        );
        _;
    }

    function verifyMerkleTree(bytes32[] calldata merkleProof)
        public
        view
        returns (bool)
    {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        return MerkleProof.verify(merkleProof, whitelistMerkleRoot, leaf);
    }

    function mintWhitelist(bytes32[] calldata merkleProof, uint256 tokenId)
        public   
        isValidMerkleProof(merkleProof, whitelistMerkleRoot)
        nonReentrant
    {
        require(tokenCount <= maxSupply, "Maximum number of tokens allowed was reached (409)");
        require(!claimed[msg.sender], "Only one token is allowed per address");
        tokenCount++;
        _mint(msg.sender, tokenId);
        
        if(owner() != msg.sender) claimed[msg.sender] = true;
        tokenAvatar[msg.sender] = tokenId;
        
        emit newTokenMinted(msg.sender, tokenId); 
    }

    function mintTransfer(address addressMint, uint256 tokenId)
        public        
        nonReentrant
    {
        require(tokenCount <= maxSupply, "Maximum number of tokens allowed was reached (409)"); 
        tokenCount++;
        _mint(addressMint, tokenId);      
        tokenAvatar[msg.sender] = tokenId;

        emit newTokenMinted(addressMint, tokenId); 
    }
    
    function tokenURI(uint256 tokenId)
      public
      view
      virtual
      override
      returns (string memory)
    {
      require(_exists(tokenId), "Error: Query for nonexistent token");
      return string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"));
    }
    
    function contractURI() public view returns (string memory) {
        return _collectionURI;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
      baseURI = _baseURI;
    }

    function setCollectionURI(string memory collectionURI) internal virtual onlyOwner {
        _collectionURI = collectionURI;
    }
    
    function setWhitelistMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        whitelistMerkleRoot = merkleRoot;
    }    
}