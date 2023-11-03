import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LoyaltyProgramFactoryAbi from "./../Abi/loyalty-program-factory.json";
import { formatDate } from "../utils/dateUtils.js";

export default function TokensMintedEvents({ address }) {
  const [tokensMintedEvents, setTokensMintedEvents] = useState([]);

  async function fetchTokensMintedEvents() {
    if (address) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS,
        LoyaltyProgramFactoryAbi.abi,
        provider
      );

      // Set up filter for TokensMintedTo event
      const filter = contract.filters.TokensMintedTo(
        import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS,
        null,
        null,
        null
      );
      const logs = await contract.queryFilter(filter);

      // Parse the logs for the event data
      const events = logs.map((log) => ({
        transactionHash: log.transactionHash,
        event: contract.interface.parseLog(log),
      }));
      return events;
    }
  }

  useEffect(() => {
    async function fetchData() {
      const fetchedTokensMintedEvents = await fetchTokensMintedEvents();
      setTokensMintedEvents(fetchedTokensMintedEvents);
    }

    if (address) {
      fetchData();
    }
  }, [address]);

  return (
    <div className="tokens-minted-list">
      <h2 className="transactions-subtitle">Tokens Minted</h2>
      <div className="transaction-section">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Tx Hash</th>
              <th>To</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tokensMintedEvents.map((eventData, index) => (
              <tr key={index}>
                <td>
                  <a href={`https://sepolia.etherscan.io/tx/${eventData.transactionHash}`} target="_blank" rel="noopener noreferrer">
                    {`${eventData.transactionHash.slice(0, 7)}...${eventData.transactionHash.slice(-7)}`}
                  </a>
                </td>
                <td>
                  {`${eventData.event.args.to.slice(0, 7)}...${eventData.event.args.to.slice(-7)}`}
                </td>
                <td>
                  {ethers.formatEther(eventData.event.args.amount.toString())} OMW
                </td>
                <td>
                <td>{formatDate(eventData.event.args.timestamp.toString())} </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
