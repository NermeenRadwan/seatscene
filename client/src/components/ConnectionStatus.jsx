import React, { useState, useEffect } from 'react';
import { checkServerStatus } from '../services/api';
import './ConnectionStatus.css';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    connected: false,
    checking: true,
    message: 'Checking connection...'
  });

  useEffect(() => {
    const checkConnection = async () => {
      setStatus({
        connected: false,
        checking: true,
        message: 'Checking connection...'
      });

      const result = await checkServerStatus();
      
      setStatus({
        connected: result.connected,
        checking: false,
        message: result.connected 
          ? 'Connected to server' 
          : `Not connected: ${result.error}`
      });
    };

    // Check connection on mount
    checkConnection();

    // Set up interval to check connection every 30 seconds
    const intervalId = setInterval(checkConnection, 30000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (status.checking) {
    return (
      <div className="connection-status checking">
        <div className="connection-indicator checking"></div>
        <span>Checking connection...</span>
      </div>
    );
  }

  return (
    <div className={`connection-status ${status.connected ? 'connected' : 'disconnected'}`}>
      <div className={`connection-indicator ${status.connected ? 'connected' : 'disconnected'}`}></div>
      <span title={status.message}>
        {status.connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

export default ConnectionStatus; 