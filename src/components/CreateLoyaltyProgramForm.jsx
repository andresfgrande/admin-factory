import React, { useState } from 'react';
import { ethers } from 'ethers';
import LoyaltyProgramFactoryAbi from './../Abi/loyalty-program-factory.json';

export default function CreateLoyaltyProgramForm() {
  const [commerceAddress, setCommerceAddress] = useState('');
  const [commerceName, setCommerceName] = useState('');
  const [commercePrefix, setCommercePrefix] = useState('');
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  const handleCreateLoyaltyProgram = async (event) => {
    event.preventDefault();
    setTransactionInProgress(true);
    try {
      const signer = await (new ethers.BrowserProvider(window.ethereum)).getSigner();
      const contract = new ethers.Contract(import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS, LoyaltyProgramFactoryAbi.abi, signer);
      const tx = await contract.createLoyaltyProgram(commerceAddress, commerceName, commercePrefix);
      await tx.wait();
      alert('Loyalty program created successfully!');
      setCommerceAddress('');
      setCommerceName('');
      setCommercePrefix('');
    } catch (error) {
      console.error('Error creating loyalty program:', error);
      alert('There was an error creating the loyalty program.');
    }
    setTransactionInProgress(false);
  };

  return (
    <form onSubmit={handleCreateLoyaltyProgram} className="create-form">
      <h3 className='form-title'>Create Loyalty Program</h3>
      <input
        type="text"
        id="commerceAddress"
        value={commerceAddress}
        onChange={(e) => setCommerceAddress(e.target.value)}
        className="form-input"
        placeholder="Commerce Address"
        required
      />
      <input
        type="text"
        id="commerceName"
        value={commerceName}
        onChange={(e) => setCommerceName(e.target.value)}
        className="form-input"
        placeholder="Commerce Name"
        required
      />
      <input
        type="text"
        id="commercePrefix"
        value={commercePrefix}
        onChange={(e) => setCommercePrefix(e.target.value.toUpperCase())}
        className="form-input"
        placeholder="Commerce Prefix"
        required
      />
      <button type="submit" className={`form-button ${transactionInProgress ? 'button-disabled' : ''}`} disabled={transactionInProgress}>
        {transactionInProgress ? 'Creating...' : 'Create Loyalty Program'}
      </button>
    </form>
  );
}
