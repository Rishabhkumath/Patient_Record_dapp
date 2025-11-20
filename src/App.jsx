import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PatientDashboard from './components/PatientDashboard.jsx';
import DoctorDashboard from './components/DoctorDashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { MedicalRecordsABI } from './utils/contractABI.js';
import contractAddress from './utils/contractAddress.json';

function App() {
  const [account, setAccount] = useState('');
  const [role, setRole] = useState('patient');
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [systemReady, setSystemReady] = useState(false);

  useEffect(() => {
    checkSystemReady();
  }, []);

  const checkSystemReady = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      
      await provider.getNetwork();
      const accountList = await provider.listAccounts();
      setAccounts(accountList);
      
      const medicalRecordsContract = new ethers.Contract(
        contractAddress.address,
        MedicalRecordsABI,
        provider
      );
      
      await medicalRecordsContract.getStats();
      setSystemReady(true);
      console.log("✅ System ready - Contract is deployed");
      
    } catch (error) {
      console.log("⚠️  System not ready - Contract may not be deployed");
      setSystemReady(false);
    }
  };

  const connectToAccount = async (selectedAccount) => {
    try {
      setLoading(true);
      
      const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      const signer = provider.getSigner(selectedAccount);
      
      setAccount(selectedAccount);
      
      const medicalRecordsContract = new ethers.Contract(
        contractAddress.address,
        MedicalRecordsABI,
        signer
      );
      
      setContract(medicalRecordsContract);
      setIsConnected(true);
      
      await determineUserRole(selectedAccount, medicalRecordsContract);
      
    } catch (error) {
      console.error('Error connecting:', error);
      alert('Error connecting to account. Make sure contract is deployed.');
    } finally {
      setLoading(false);
    }
  };

  const determineUserRole = async (userAccount, contractInstance) => {
    try {
      const admin = await contractInstance.admin();
      if (userAccount.toLowerCase() === admin.toLowerCase()) {
        setRole('admin');
        return;
      }

      try {
        const doctor = await contractInstance.getDoctor(userAccount);
        if (doctor.exists) {
          setRole('doctor');
          return;
        }
      } catch (error) {
        // Not a doctor, continue
      }

      setRole('patient');
    } catch (error) {
      console.error('Error determining role:', error);
      setRole('patient');
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount('');
    setContract(null);
  };

  const renderDashboard = () => {
    if (!contract) return null;

    switch (role) {
      case 'patient':
        return <PatientDashboard account={account} contract={contract} />;
      case 'doctor':
        return <DoctorDashboard account={account} contract={contract} />;
      case 'admin':
        return <AdminPanel account={account} contract={contract} />;
      default:
        return <PatientDashboard account={account} contract={contract} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800">MediChain</h1>
              {isConnected && (
                <span className={`bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              )}
              {!systemReady && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Setup Required
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <>
                  <span className="text-sm text-gray-600">
                    {account ? `${account.substring(0, 6)}...${account.substring(38)}` : ''}
                  </span>
                  <button
                    onClick={disconnect}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <span className="text-sm text-gray-500">
                  {systemReady ? "Select account below" : "System setup required"}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {!systemReady ? (
          <div className="text-center">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                🏥 Medical Records System
              </h1>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  System Setup Required
                </h3>
                <p className="text-yellow-700 mb-4">
                  The medical records contract needs to be deployed first.
                </p>
                <div className="text-left bg-yellow-100 p-4 rounded">
                  <p className="text-sm font-mono mb-2">1. Start blockchain: <code>npx hardhat node</code></p>
                  <p className="text-sm font-mono mb-2">2. Deploy contract: <code>npx hardhat run scripts/deploy.js --network localhost</code></p>
                  <p className="text-sm font-mono">3. Refresh this page</p>
                </div>
              </div>
            </div>
          </div>
        ) : !isConnected ? (
          <div className="text-center">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Secure Medical Records dApp
              </h1>
              <p className="text-gray-600 mb-8">
                ✅ System Ready - Select an account to continue
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Available Accounts:</h3>
                {accounts.length === 0 ? (
                  <p className="text-red-500">No accounts found. Make sure Hardhat node is running!</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {accounts.map((acc, index) => (
                      <button
                        key={acc}
                        onClick={() => connectToAccount(acc)}
                        disabled={loading}
                        className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-mono text-sm">{acc}</p>
                            <p className="text-xs text-gray-500">Account #{index} • 10,000 ETH</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Connect
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          renderDashboard()
        )}
      </main>
    </div>
  );
}

export default App;