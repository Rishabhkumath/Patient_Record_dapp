import hre from "hardhat";
import fs from "fs";

async function main() {
  const { ethers } = hre;
  
  if (!fs.existsSync("./hospital-data/deployment.json")) {
    console.log("❌ No existing deployment found. Run deploy.js first.");
    return;
  }
  
  const deployment = JSON.parse(fs.readFileSync("./hospital-data/deployment.json"));
  console.log("🔍 Found existing deployment:", deployment.contractAddress);
  
  const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
  const medicalRecords = await MedicalRecords.attach(deployment.contractAddress);
  
  console.log("✅ Connected to existing contract");
  
  try {
    const stats = await medicalRecords.getStats();
    console.log("📊 Current stats - Patients:", stats[0].toString(), "Doctors:", stats[1].toString(), "Records:", stats[2].toString());
  } catch (error) {
    console.log("⚠️  Contract exists but may need reconfiguration");
  }
}

main().catch(console.error);