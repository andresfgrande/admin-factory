import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LoyaltyProgramFactoryAbi from "./../Abi/loyalty-program-factory.json";

export default function CommerceList({ address }) {
  const [commerces, setCommerces] = useState([]);

  const copyAddressToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied!');
    } catch (error) {
    }
  };

  useEffect(() => {
    const fetchCommerces = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS,
        LoyaltyProgramFactoryAbi.abi,
        provider
      );

      try {
        const commerceCount = Number(await contract.getCommerceCount());
        const commerceDetailsPromises = [];

        for (let i = 0; i < commerceCount; i++) {
          commerceDetailsPromises.push(contract.commerceAddresses(i));
        }

        const commerceAddresses = await Promise.all(commerceDetailsPromises);
        const commerceDetails = await Promise.all(
          commerceAddresses.map((address) => contract.commerceDetailsByAddress(address))
        );

        setCommerces(commerceDetails.map((detail, index) => ({
          name: detail[0],
          loyaltyProgramAddress: detail[1],
          prefix: detail[2],
          address: commerceAddresses[index],
        })));
      } catch (error) {
        console.error("Error fetching commerce details:", error);
      }
    };

    if (address) {
      fetchCommerces();
    }
  }, [address]);
  return (
    <div className="commerce-list">
        <h2>Commerces</h2>
      {commerces.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Loyalty Program Address</th>
              <th>Prefix</th>
              <th>Commerce Address</th>
            </tr>
          </thead>
          <tbody>
            {commerces.map((commerce, index) => (
              <tr key={index}>
                <td>{commerce.name}</td>
                <td className="copy-address-row" onClick={()=>copyAddressToClipboard(commerce.loyaltyProgramAddress)}>{commerce.loyaltyProgramAddress.slice(0,10)}...{commerce.loyaltyProgramAddress.slice(-10)}</td>
                <td>{commerce.prefix}</td>
                <td>{commerce.address.slice(0,10)}...{commerce.address.slice(-10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No commerces found.</p>
      )}
    </div>
  );
  
}