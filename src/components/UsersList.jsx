import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LoyaltyProgramFactoryAbi from "./../Abi/loyalty-program-factory.json";
import { formatDate } from "../utils/dateUtils.js";

export default function UsersList({address}) {
    
    const [usersList, setUsersList] = useState([]);

    async function fetchUserEvents() {
        if(address){
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS, LoyaltyProgramFactoryAbi.abi, provider);
    
            const filter = contract.filters.UserAdded(import.meta.env.VITE_LOYALTY_PROGRAM_FACTORY_ADDRESS, null, null, null, null); 
            const logs = await contract.queryFilter(filter);
        
            const events = logs.map(log => ({
                transactionHash: log.transactionHash,
                event: contract.interface.parseLog(log)
            }));
            return events;
        }
    }

    useEffect(() => {
        async function fetchData() {
            const fetchedUserEvents = await fetchUserEvents();
            setUsersList(fetchedUserEvents);
        }

        if(address){
            fetchData()
        }
   
        
    }, [address]);


    return(
        <div className="users-list">
        <h2 className="transactions-subtitle">Users</h2>
        <div className="transaction-section">
              <table className="transaction-table transaction-table-5">
                     <thead>
                         <tr>
                             <th>Tx Hash</th>
                             <th>Loyalty Program</th>
                             <th>Loyalty ID</th>
                             <th>User</th>
                             <th>Date</th>
                         </tr>
                     </thead>
                     <tbody>
                        {usersList.map((eventData, index) => (
                            <tr key={index}>
                                <td><a href={`https://sepolia.etherscan.io/tx/${eventData.transactionHash}`} target="_blank">{`${eventData.transactionHash.slice(0,7)}...${eventData.transactionHash.slice(-7)}`}</a></td>
                                <td>{`${eventData.event.args.loyaltyProgram.slice(0,7)}...${eventData.event.args.loyaltyProgram.slice(-7)}`}</td>
                                <td>{`${eventData.event.args.loyaltyId}`}</td>
                                <td>{`${eventData.event.args.userAddress.slice(0,7)}...${eventData.event.args.userAddress.slice(-7)}`}</td>
                                <td>{formatDate(eventData.event.args.timestamp.toString())} </td>
                            </tr>
                        ))}
                     </tbody>
                 </table>
        </div>
        </div>
    )
}
