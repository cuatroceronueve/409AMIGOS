async function main() {
  const Mint409 = await ethers.getContractFactory("Mint409");

  const mint409 = await Mint409.deploy(
    "https://gateway.pinata.cloud/ipfs/QmakNUgFuauffT4xKm9qBaTuQv5jutQW4bzNtWn6QPcLSG/",
    ""
  );
  console.log("Contract deployed to address:", mint409.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
