import React, { useState, useEffect } from 'react';

const MedicalRecordsList = ({ account, contract, userRole }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [account, contract]);

  const loadRecords = async () => {
    if (!contract) return;
    
    try {
      const recordIds = await contract.getPatientRecordIds(account);
      const recordsData = [];
      
      for (let id of recordIds) {
        try {
          const record = await contract.getMedicalRecord(id);
          recordsData.push({
            id: id.toString(),
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            medication: record.medication,
            notes: record.notes,
            date: new Date(parseInt(record.date) * 1000).toLocaleDateString(),
            doctor: record.doctorAddress
          });
        } catch (error) {
          console.error(`Error loading record ${id}:`, error);
        }
      }
      
      setRecords(recordsData);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Medical Records</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {records.length} records
        </span>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">No medical records found.</p>
          <p className="text-gray-400 text-sm">Records will appear here once your doctors add them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <div key={record.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">Record #{record.id}</h4>
                  <p className="text-sm text-gray-500">Date: {record.date}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Diagnosis</label>
                  <p className="text-gray-900 mt-1">{record.diagnosis || 'Not specified'}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Treatment</label>
                  <p className="text-gray-900 mt-1">{record.treatment || 'Not specified'}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Medication</label>
                  <p className="text-gray-900 mt-1">{record.medication || 'Not specified'}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Doctor</label>
                  <p className="text-gray-900 font-mono text-xs mt-1">
                    {record.doctor.substring(0, 8)}...{record.doctor.substring(36)}
                  </p>
                </div>
              </div>
              
              {record.notes && (
                <div className="mt-3">
                  <label className="font-medium text-gray-700">Additional Notes</label>
                  <p className="text-gray-900 text-sm mt-1">{record.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsList;