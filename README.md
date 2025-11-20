# Patient Record DApp

This project is a decentralized application for storing and managing patient health records using blockchain technology. The goal is to keep medical data secure, private, and accessible only through the smart contract. The system runs completely on the Hardhat local blockchain (no MetaMask used).

## Features

### For Patients
- Register as a patient  
- Add or update medical records  
- Give access to doctors  
- View complete medical history  

### For Doctors
- View patient records (only if access is granted)  
- Add diagnosis or prescription details  

### Security
- Records stored securely on the local blockchain  
- Data cannot be changed once stored (immutable)  
- Access handled through smart contract functions  

## Tech Stack

### Frontend
- React + Vite  
- Ethers.js (for connecting to Hardhat RPC)  

### Blockchain
- Solidity  
- Hardhat  

### Tools
- Node.js  
- Hardhat Local Network  

## How to Run the Project

### 1. Install dependencies
npm install

### 2. Start the Hardhat local blockchain
npx hardhat node

### 3. Deploy the smart contract
npx hardhat run scripts/deploy.js --network localhost

### 4. Start the frontend
npm run dev

The frontend will automatically connect to the Hardhat RPC (http://127.0.0.1:8545).

## Smart Contract Overview (PatientRecord.sol)

This smart contract controls how patient data is stored and who can access it.

### Main Functions
- registerPatient() — register a new patient  
- addRecord() — add or update a medical record  
- grantAccess(address doctor) — allow a doctor to view records  
- getRecord(address patient) — fetch record of a patient  

## Testing (Optional)
npx hardhat test

## Future Enhancements
- Use IPFS for storing larger medical files  
- Add multiple user roles (hospital admin, nurse, etc.)  
- Improve the UI  
- Add notifications for access requests  
