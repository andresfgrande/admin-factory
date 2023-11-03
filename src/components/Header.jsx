import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Header({ address, balance, setAddress, setBalance, setWalletConnected, walletConnected }) {

    useEffect(() => {
        const ethereum = window.ethereum;
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                console.log('Please connect to MetaMask.');
                setWalletConnected(false);
            } else if (accounts[0] !== address) {
                setAddress(accounts[0]);
                fetchBalance(accounts[0]);
            }
        };

        if (ethereum) {
            ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (ethereum) {
                ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [address, setWalletConnected, setAddress]);

    const fetchBalance = async (address) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));
    };

    const handleConnectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

                let addressAux = await signer.getAddress();
                let balanceAux = await provider.getBalance(addressAux);

                setAddress(addressAux);
                setBalance(ethers.formatEther(balanceAux));
                setWalletConnected(true);

            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
            }
        } else {
            console.log("Please install MetaMask!");
        }
    };

    const formatBalance = (balance) => {
        return parseFloat(balance).toFixed(3); 
    };

    const formatAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-6)}`; 
    };

    return (
        <div className="App">
            <header className="header">
                <span className="balance">
                    {walletConnected && `${formatBalance(balance)} ETH`} 
                </span>
                <button onClick={handleConnectWallet} className="connect-button">
                    {walletConnected ? formatAddress(address) : 'Connect Wallet'}
                </button>
            </header>
        </div>
    );
}
