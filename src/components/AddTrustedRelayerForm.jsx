import React, { useState } from 'react';
import { ethers } from 'ethers';
import LoyaltyProgramFactoryAbi from './../Abi/loyalty-program-factory.json';

export default function AddTrustedRelayerForm({  }) {
  const [loyaltyProgramAddress, setLoyaltyProgramAddress] = useState('');
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  const handleAddTrustedRelayer = async (event) => {
    event.preventDefault();
    setTransactionInProgress(true);
    try {
      // Assuming that window.ethereum is available and the user has connected their wallet
      const signer = await (new ethers.BrowserProvider(window.ethereum)).getSigner();
      const contract = new ethers.Contract(import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS, LoyaltyProgramFactoryAbi.abi, signer);
      const tx = await contract.addTrustedRelayer(loyaltyProgramAddress);
      await tx.wait();
      alert('Trusted relayer added successfully!');
      setLoyaltyProgramAddress('');
    } catch (error) {
      console.error('Error adding trusted relayer:', error);
      alert('There was an error adding the trusted relayer.');
    }
    setTransactionInProgress(false);
  };

  return (
    <form onSubmit={handleAddTrustedRelayer} className="relayer-form">
      <h3 className='form-title'>Add Trusted Relayer</h3>
      <input
        type="text"
        id="loyaltyProgramAddress"
        value={loyaltyProgramAddress}
        onChange={(e) => setLoyaltyProgramAddress(e.target.value)}
        className="form-input"
        placeholder="Loyalty Program Address"
        required
      />
      <button type="submit" className={`form-button ${transactionInProgress ? 'button-disabled' : ''}`} disabled={transactionInProgress}>
        {transactionInProgress ? 'Adding...' : 'Add Trusted Relayer'}
      </button>
    </form>
  );
}
