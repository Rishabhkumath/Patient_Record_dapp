import React, { useState } from 'react';

const DoctorDashboard = ({ account, contract }) => {
  const [formData, setFormData] = useState({
    patientAddress: '',
    diagnosis: '',
    treatment: '',
    medication: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tx = await contract.addMedicalRecord(
        formData.patientAddress,
        formData.diagnosis,
        formData.treatment,
        formData.medication,
        formData.notes
      );
      await tx.wait();
      alert('Medical record added successfully!');
      setFormData({
        patientAddress: '',
        diagnosis: '',
        treatment: '',
        medication: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding record:', error);
      alert('Error adding record: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
        <p className="text-gray-600">Add and manage patient medical records</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Add Medical Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Address</label>
            <input
              type="text"
              required
              value={formData.patientAddress}
              onChange={(e) => setFormData({...formData, patientAddress: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
            <textarea
              required
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter diagnosis..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Treatment</label>
            <textarea
              value={formData.treatment}
              onChange={(e) => setFormData({...formData, treatment: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter treatment plan..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Medication</label>
            <input
              type="text"
              value={formData.medication}
              onChange={(e) => setFormData({...formData, medication: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter prescribed medication..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Any additional notes..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Adding Record...' : 'Add Medical Record'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Doctor Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="font-medium text-gray-700">Wallet Address</label>
            <p className="text-gray-900 font-mono text-xs mt-1">{account}</p>
          </div>
          <div>
            <label className="font-medium text-gray-700">Status</label>
            <p className="text-green-600 mt-1">Authorized</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;