import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "./Header";
import Info from "./Info";
import CommerceList from "./CommerceList";
import UsersList from "./UsersList";
import Actions from "./Actions";
import TokensMintedEvents from "./TokensMintedEvents";
import TrustedRelayersEvents from "./TrustedRelayerEvents";

export default function Dashboard() {
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const [walletConnected, setWalletConnected] = useState(false);

    return (
        <>
            <Header 
                address={address} 
                balance={balance} 
                setAddress={setAddress} 
                setBalance={setBalance}
                setWalletConnected={setWalletConnected}
                walletConnected={walletConnected} 
            />
            <h1>Dashboard - Loyalty Factory</h1>
            <Info address={address} ></Info>
            <CommerceList address={address} ></CommerceList>
            <UsersList address={address}></UsersList>
            <Actions></Actions>
            <TokensMintedEvents  address={address}></TokensMintedEvents>
            <TrustedRelayersEvents  address={address}></TrustedRelayersEvents>
        </>
    );
}
