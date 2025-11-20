import React, { useState } from 'react';

const AdminPanel = ({ account, contract }) => {
  const [doctorData, setDoctorData] = useState({
    address: '',
    name: '',
    specialization: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const registerDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tx = await contract.registerDoctor(
        doctorData.address,
        doctorData.name,
        doctorData.specialization,
        doctorData.licenseNumber
      );
      await tx.wait();
      alert('Doctor registered successfully!');
      setDoctorData({
        address: '',
        name: '',
        specialization: '',
        licenseNumber: ''
      });
    } catch (error) {
      console.error('Error registering doctor:', error);
      alert('Error registering doctor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-gray-600">Manage doctors and system settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Register New Doctor</h2>
        <form onSubmit={registerDoctor} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor Address</label>
              <input
                type="text"
                required
                value={doctorData.address}
                onChange={(e) => setDoctorData({...doctorData, address: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={doctorData.name}
                onChange={(e) => setDoctorData({...doctorData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                required
                value={doctorData.specialization}
                onChange={(e) => setDoctorData({...doctorData, specialization: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cardiology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">License Number</label>
              <input
                type="text"
                required
                value={doctorData.licenseNumber}
                onChange={(e) => setDoctorData({...doctorData, licenseNumber: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MED123456"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Registering...' : 'Register Doctor'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">System Information</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">Admin</p>
            <p className="text-gray-600">Role</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">Full</p>
            <p className="text-gray-600">Access Level</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">Active</p>
            <p className="text-gray-600">Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;