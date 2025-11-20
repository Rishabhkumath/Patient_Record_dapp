import React, { useState } from 'react';

const AccessManagement = ({ account, contract }) => {
  const [doctorAddress, setDoctorAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const grantAccess = async (e) => {
    e.preventDefault();
    if (!doctorAddress) {
      alert('Please enter a doctor address');
      return;
    }
    
    setLoading(true);
    try {
      const tx = await contract.grantAccess(doctorAddress);
      await tx.wait();
      alert('Access granted successfully!');
      setDoctorAddress('');
    } catch (error) {
      console.error('Error granting access:', error);
      alert('Error granting access: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const revokeAccess = async () => {
    if (!doctorAddress) {
      alert('Please enter a doctor address');
      return;
    }
    
    setLoading(true);
    try {
      const tx = await contract.revokeAccess(doctorAddress);
      await tx.wait();
      alert('Access revoked successfully!');
      setDoctorAddress('');
    } catch (error) {
      console.error('Error revoking access:', error);
      alert('Error revoking access: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Manage Doctor Access</h3>
        
        <form onSubmit={grantAccess} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor's Ethereum Address
            </label>
            <input
              type="text"
              value={doctorAddress}
              onChange={(e) => setDoctorAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Granting...' : 'Grant Access'}
            </button>
            
            <button
              type="button"
              onClick={revokeAccess}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Revoking...' : 'Revoke Access'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold mb-3">How It Works</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">Grant Access</h5>
            <p className="text-green-700">Allow doctors to view and add to your medical records</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-2">Revoke Access</h5>
            <p className="text-blue-700">Immediately remove a doctor's access to your records</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h5 className="font-medium text-purple-800 mb-2">Complete Control</h5>
            <p className="text-purple-700">You have full control over who can access your data</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h5 className="font-medium text-orange-800 mb-2">Transparent</h5>
            <p className="text-orange-700">All access changes are recorded on the blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessManagement;