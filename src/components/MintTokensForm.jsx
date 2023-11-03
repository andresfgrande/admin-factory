import React, { useState } from 'react';
import { ethers } from 'ethers';
import LoyaltyProgramFactoryAbi from './../Abi/loyalty-program-factory.json';


export default function MintTokensForm({ }) {
  const [amount, setAmount] = useState('');
  const [loyaltyProgramAddress, setLoyaltyProgramAddress] = useState('');
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  const handleMintTokens = async (event) => {

    console.log(loyaltyProgramAddress,amount)
    event.preventDefault();
    setTransactionInProgress(true);
    try {
      const signer = await (new ethers.BrowserProvider(window.ethereum)).getSigner();
      const contract = new ethers.Contract(import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS, LoyaltyProgramFactoryAbi.abi, signer);
      const tx = await contract.mintTokensToAddress(ethers.parseUnits(amount,18), loyaltyProgramAddress);
      await tx.wait();
      alert('Tokens minted successfully!');
      setLoyaltyProgramAddress('');
      setAmount('');
    } catch (error) {
      console.error('Error minting tokens:', error);
      alert('There was an error minting the tokens.');
    }
    setTransactionInProgress(false);
  };

  return (
    <form onSubmit={handleMintTokens} className="mint-form">
        <h3 className='form-title'>Mint Tokens</h3>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-input"
          placeholder="Amount to mint"
          required
        />
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
        {transactionInProgress ? 'Minting...' : 'Mint Tokens'}
      </button>
    </form>
  );
}
