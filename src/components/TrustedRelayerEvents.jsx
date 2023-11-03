import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LoyaltyProgramFactoryAbi from "./../Abi/loyalty-program-factory.json";
import { formatDate } from "../utils/dateUtils.js";

export default function TrustedRelayersEvents({ address }) {
  const [trustedRelayers, setTrustedRelayers] = useState([]);

  async function fetchTrustedRelayerEvents() {
    if (address) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS,
        LoyaltyProgramFactoryAbi.abi,
        provider
      );

      const filter = contract.filters.TrustedRelayerAdded(
        import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS,
        null
      );
      const logs = await contract.queryFilter(filter);


      const events = logs.map((log) => ({
        transactionHash: log.transactionHash,
        event: contract.interface.parseLog(log),
      }));
      return events;
    }
  }

  useEffect(() => {
    async function fetchData() {
      const fetchedTrustedRelayerEvents = await fetchTrustedRelayerEvents();
      setTrustedRelayers(fetchedTrustedRelayerEvents);
    }

    if (address) {
      fetchData();
    }
  }, [address]);

  return (
    <div className="trusted-relayers-list">
      <h2 className="transactions-subtitle">Trusted Relayers</h2>
      <div className="transaction-section">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Tx Hash</th>
              <th>Relayer Address</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {trustedRelayers.map((eventData, index) => (
              <tr key={index}>
                 <td>
                  <a href={`https://sepolia.etherscan.io/tx/${eventData.transactionHash}`} target="_blank" rel="noopener noreferrer">
                    {`${eventData.transactionHash.slice(0, 7)}...${eventData.transactionHash.slice(-7)}`}
                  </a>
                </td>
                <td>
                  {`${eventData.event.args.relayer.slice(0, 7)}...${eventData.event.args.relayer.slice(-7)}`}
                </td>
                <td>{formatDate(eventData.event.args.timestamp.toString())} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
