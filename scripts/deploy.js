import hre from "hardhat";
import fs from "fs";

async function main() {
  const { ethers } = hre;
  
  console.log("🏥 Deploying CLEAN Medical Records System...");
  
  const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
  const medicalRecords = await MedicalRecords.deploy();
  
  await medicalRecords.deployed();
  
  console.log("✅ MedicalRecords deployed to:", medicalRecords.address);
  
  // Save contract address for frontend
  const contractAddress = {
    address: medicalRecords.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync("./src/utils/contractAddress.json", JSON.stringify(contractAddress, null, 2));
  
  console.log("🎉 CLEAN system ready!");
  console.log("📝 No patients or doctors registered");
  console.log("💡 You can now register everything manually");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});