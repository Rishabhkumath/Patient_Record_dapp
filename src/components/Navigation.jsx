import React from 'react';

const Navigation = ({ account, role, isConnected, onDisconnect }) => {
  return (
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
          </div>
          
          {isConnected && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {account ? `${account.substring(0, 6)}...${account.substring(38)}` : ''}
              </span>
              <button
                onClick={onDisconnect}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;