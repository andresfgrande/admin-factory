import React from "react";
import { ethers } from "ethers";
import LoyaltyProgramFactoryAbi from "./../Abi/loyalty-program-factory.json";
import MintTokensForm from "./MintTokensForm";
import CreateLoyaltyProgramForm from "./CreateLoyaltyProgramForm";
import AddTrustedRelayerForm from "./AddTrustedRelayerForm";

export default function Actions() {

  return (
    <>
    <h2>Actions</h2>
     <div className="forms-grid">
      <div className="form-container">
        <CreateLoyaltyProgramForm />
      </div>
      <div className="form-container">
        <MintTokensForm />
      </div>
      <div className="form-container">
        <AddTrustedRelayerForm />
      </div>
      
    </div>
    </>
   
  );
}
