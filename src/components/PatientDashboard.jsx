import React, { useState, useEffect } from 'react';
import PatientRegistration from './PatientRegistration.jsx';
import MedicalRecordsList from './MedicalRecordsList.jsx';
import AccessManagement from './AccessManagement.jsx';

const PatientDashboard = ({ account, contract }) => {
  const [activeTab, setActiveTab] = useState('records');
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPatientRegistration();
  }, [account, contract]);

  const checkPatientRegistration = async () => {
    if (!contract) return;
    
    try {
      const patient = await contract.getPatient(account);
      if (patient.exists) {
        setPatientInfo({
          name: patient.name,
          dateOfBirth: new Date(parseInt(patient.dateOfBirth) * 1000).toLocaleDateString(),
          gender: patient.gender,
          publicKey: patient.publicKey
        });
      }
    } catch (error) {
      console.error('Error checking patient registration:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patientInfo) {
    return <PatientRegistration account={account} contract={contract} onRegistrationComplete={checkPatientRegistration} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {patientInfo.name}</h1>
            <p className="text-gray-600">Manage your medical records and access permissions</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Patient ID</p>
            <p className="text-sm font-mono font-medium">{account.substring(0, 10)}...</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg mb-6">
        <nav className="flex -mb-px">
          {[
            { id: 'records', label: 'Medical Records' },
            { id: 'access', label: 'Access Control' },
            { id: 'profile', label: 'Profile' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === 'records' && (
          <MedicalRecordsList account={account} contract={contract} userRole="patient" />
        )}
        {activeTab === 'access' && (
          <AccessManagement account={account} contract={contract} />
        )}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{patientInfo.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="mt-1 text-sm text-gray-900">{patientInfo.dateOfBirth}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 text-sm text-gray-900">{patientInfo.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{account}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;