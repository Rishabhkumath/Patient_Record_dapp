import React, { useState } from 'react';

const PatientRegistration = ({ account, contract, onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    publicKey: 'patient-key-' + Math.random().toString(36).substr(2, 9)
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tx = await contract.registerPatient(
        formData.name,
        Math.floor(new Date(formData.dob).getTime() / 1000),
        formData.gender,
        formData.publicKey
      );
      await tx.wait();
      alert('Registration successful!');
      window.location.reload(); 
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Patient Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            required
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            required
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Public Key</label>
          <input
            type="text"
            required
            value={formData.publicKey}
            onChange={(e) => setFormData({...formData, publicKey: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your public key"
          />
          <p className="text-xs text-gray-500 mt-1">
            This is used for encrypting your medical records
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-200"
        >
          {loading ? 'Registering...' : 'Register Patient'}
        </button>
      </form>
    </div>
  );
};

export default PatientRegistration;