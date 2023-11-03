import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LoyaltyProgramAbi from "./../Abi/loyalty-program-factory.json"

export default function Info({address}){

    const [tokenAddress, setTokenAddress] = useState('');

    useEffect(() => {

        async function getInfo(){
            const provider = new ethers.BrowserProvider(window.ethereum);
            const factoryContract = new ethers.Contract(import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS, LoyaltyProgramAbi.abi, provider)
            const tokenAddressAux = await factoryContract.omniToken();
            setTokenAddress(tokenAddressAux);
        }

        getInfo();
       
    }, [address])
    
    return(
        <div className="info-container">
            <div className="token-address-display">
            <span className="token-address-label">Factory Address: </span>
            <span className="token-address">{import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS}</span>
        </div>
        <div className="token-address-display">
            <span className="token-address-label">OmniToken: </span>
            <span className="token-address">{tokenAddress}</span>
        </div>
    </div>
    )
}