# Patient Record DApp

A decentralized application (DApp) for securely storing, managing, and accessing patient health records using blockchain technology.  
This system ensures **data privacy**, **immutability**, and **secure access control** using Ethereum smart contracts.

---

##  Features

###  Patient Features
- Register as a patient on blockchain  
- Add or update medical records  
- Grant access to doctors securely  
- View entire medical history anytime  

###  Doctor Features
- View patient records (only if access granted)  
- Add diagnosis or prescriptions  

###  Security
- Ethereum blockchain-based  
- Tamper-proof health records  
- MetaMask wallet authentication  
- Restricted access through smart contracts  

---

##  Tech Stack

### Frontend
- React + Vite  
- Ethers.js  
- MetaMask Integration  

### Blockchain
- Solidity  
- Hardhat  
- ABI-based contract calls  

### Tools
- Node.js  
- Local Hardhat Network  

---

##  Running the Project

###  Install Dependencies
```bash
npm install
```

###  Start Hardhat Local Blockchain
```bash
npx hardhat node
```

###  Deploy the Contract
```bash
npx hardhat run scripts/deploy.js --network localhost
```

###  Start the Frontend
```bash
npm run dev
```

###  Connect MetaMask  
Add a custom network:

```
Network Name: Localhost
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency: ETH
```

---

##  Smart Contract Overview

### PatientRecord.sol
Handles secure storage and access of patient data.

#### Key Functionalities:
- `registerPatient()` – Register a new patient  
- `addRecord()` – Add/update health data  
- `grantAccess(address doctor)` – Allow specific doctor to view data  
- `getRecord(address patient)` – Fetch patient medical records  

---

##  Testing (Optional)
```bash
npx hardhat test
```

---

##  Future Enhancements
- IPFS support for storing large files  
- Multi-hospital role-based access  
- UI improvements  
- Notification system  

---
