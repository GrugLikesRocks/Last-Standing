import React, { useState } from "react";

import { useEntityQuery } from "@latticexyz/react";

import "./PagesStyles/DebugPageStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";
import { ClickWrapper } from "../clickWrapper";

import { useDojo } from "../../hooks/useDojo";

import { CreateRevenantProps, CreateEventProps } from "../../dojo/types";

import {
  EntityIndex,
  Has,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { createSystemCalls } from "../../dojo/createSystemCalls";
import { GAME_CONFIG } from "../../phaser/constants";
import { getGameTrackerEntity } from "../../dojo/testQueries";
import { getFullOutpostGameData, getGameEntitiesSpecific, getOutpostEntitySpecific } from "../../dojo/testCalls";
import {  decimalToHexadecimal } from "../../utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";

interface DebugPageProps {
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const DebugPage: React.FC<DebugPageProps> = ({ setMenuState }) => {
  const {
    account: { account },
    networkLayer: {
      network: { contractComponents, clientComponents,graphSdk },
      systemCalls: {  create_revenant, create_event },

    },
  } = useDojo();


  //#region Outpost data stuff

  const summonRev = async () => {
    const gameTrackerComp = getComponentValueStrict(
      contractComponents.GameTracker,
      getEntityIdFromKeys([BigInt(GAME_CONFIG)])
    );
    const game_id: number = gameTrackerComp.count;

    const gameEntityCounter = getComponentValueStrict(
      contractComponents.GameEntityCounter,
      getEntityIdFromKeys([BigInt(game_id)])
    );
    const rev_counter: number = gameEntityCounter.outpost_count;

    const createRevProps: CreateRevenantProps = {
      account: account,
      game_id: game_id,
      name: "Revenant " + rev_counter,
    };

    await create_revenant(createRevProps);
  };

  const queryAllRevenantData = async () => {
    const gameTrackerComp = getComponentValueStrict(
      contractComponents.GameTracker,
      getEntityIdFromKeys([BigInt(GAME_CONFIG)])
    );

    const game_id: number = gameTrackerComp.count;

    const gameEntityCounterComp = getComponentValueStrict(
      contractComponents.GameEntityCounter,
      getEntityIdFromKeys([BigInt(game_id)])
    );

    const data = await getFullOutpostGameData(graphSdk,decimalToHexadecimal(game_id),gameEntityCounterComp.revenant_count);

    console.log(data);
  }


  const outpostArray = useEntityQuery([Has(contractComponents.Outpost)]);
  const revenantArray = useEntityQuery([Has(contractComponents.Revenant)]);
  const clientOutpostArray = useEntityQuery([Has(clientComponents.ClientOutpostData)]);

  const printAllSavedDataRevenants = () => {
    for (let index = 0; index < revenantArray.length; index++) {
      const element = revenantArray[index];
     
      const revData = getComponentValueStrict(contractComponents.Revenant, element);
      const outpostData = getComponentValueStrict(contractComponents.Outpost, element);
      const clientOutpostData = getComponentValueStrict(clientComponents.ClientOutpostData, element);
      console.log("game entity at id ", element, clientOutpostData[index]);
      
      console.log(revData);
      console.log(outpostData);
      console.log(clientOutpostData);
    }
  } 

  //#endregion


  //#region  Game Data Debug
  const gameTrackerArray = useEntityQuery([Has(contractComponents.GameTracker)]);
  const gameArray = useEntityQuery([Has(contractComponents.GameEntityCounter)]);
  const gameEntityCounterArray = useEntityQuery([Has(contractComponents.Game)]);

  const printEntitiesofGamedata = () => {
    console.log(gameArray[0]);
    console.log(gameEntityCounterArray[0]);
    console.log(gameTrackerArray[0]);

    let comp = getComponentValueStrict(contractComponents.Game, gameArray[0]);



    console.log("game entity", comp);
    comp = getComponentValueStrict(contractComponents.GameEntityCounter, gameEntityCounterArray[0]);
    console.log("game entity counter", comp);
    comp = getComponentValueStrict(contractComponents.GameTracker, gameTrackerArray[0]);
    console.log("game tracker", comp);
  }

  const queryCheckGameData = async () => {
    const game_count:any = await getGameTrackerEntity();
    console.log("game count", game_count);

    const data = await getGameEntitiesSpecific(graphSdk, decimalToHexadecimal(game_count));
    console.log("game entity data", data);
    
    console.log("\n\n");
    printEntitiesofGamedata();
    console.log("\n\n\n\n");
  }  

  //#endregion


  //#region  Client Data Debug
  const clientClickArray = useEntityQuery([Has(clientComponents.ClientClickPosition)]);
  const clientGameArray = useEntityQuery([Has(clientComponents.ClientGameData)]);
  const clientCameraArray = useEntityQuery([Has(clientComponents.ClientCameraPosition)]);

  const printEntitiesOfClientdata = () => {
    console.log(clientClickArray[0]);
    console.log(clientGameArray[0]);
    console.log(clientCameraArray[0]);

    let comp = getComponentValueStrict(clientComponents.ClientGameData, clientGameArray[0]);
    console.log("client game entity", comp);
    comp = getComponentValueStrict(clientComponents.ClientClickPosition, clientClickArray[0]);
    console.log("click entity counter", comp);
    comp = getComponentValueStrict(clientComponents.ClientCameraPosition, clientCameraArray[0]);
    console.log("camera tracker", comp);

    console.log("\n\nstart of array of client outpost Data")
    for (let index = 0; index < clientOutpostArray.length; index++) {
      const element = clientOutpostArray[index];
      getComponentValueStrict(clientComponents.ClientOutpostData, element);
      console.log("outpost client data", element);
    } 

    console.log("\nend of array of client outpost Data\n\n")
  }
  //#endregion 


  //#region event Data stuff

  const eventArray = useEntityQuery([Has(contractComponents.WorldEvent)]);

  const createEvent = async () => {
    const gameTrackerComp = getComponentValueStrict(
      contractComponents.GameTracker,
      getEntityIdFromKeys([BigInt(GAME_CONFIG)])
    );
    const game_id: number = gameTrackerComp.count;

    const gameEntityCounter = getComponentValueStrict(
      contractComponents.GameEntityCounter,
      getEntityIdFromKeys([BigInt(game_id)])
    );
    const event_counter: number = gameEntityCounter.event_count;

    const createEventProps: CreateEventProps = {
      account: account,
      game_id: game_id,
    };

    await create_event(createEventProps);
  };

  //#endregion

  const gameEntityTracker = getComponentValueStrict(contractComponents.GameEntityCounter, decimalToHexadecimal(getComponentValueStrict(clientComponents.ClientGameData,  decimalToHexadecimal(GAME_CONFIG)).current_game_id));

  return (
    <ClickWrapper className="revenant-jurnal-page-container">
      <h1 style={{ color: "white" }}>Debug Menu</h1>
      <div className="buttons-holder">

        <div className="data-container">
          <div className="button-style-debug">This is a button</div>
          <div className="content-holder">
            <h3>The current address is {account.address}</h3>
            {/* <h3>The current balance is {getComponentValueStrict(contractComponents.Reinforcement, )}</h3> */}
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => {summonRev()}}>Create a new revenant</div>
          <div className="content-holder">
            <h3>There are currently {outpostArray.length} outposts and {revenantArray.length} revenants (~{gameEntityTracker.outpost_count})</h3>
            <button onMouseDown={() => {queryAllRevenantData()}}>Fetch all Data</button>
            <button onMouseDown={() => {printAllSavedDataRevenants()}}>Print Data saved</button>
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => {queryCheckGameData()}}>Query Check everthing</div>
          <div className="content-holder">
            <h3>There are currently {gameArray.length} games (1)</h3>
            <h3>There are currently {gameTrackerArray.length} game tracker (1)</h3>
            <h3>There are currently {gameEntityCounterArray.length} game entity counter (1)</h3>
            <h3>Current Game id is {getComponentValueStrict(clientComponents.ClientGameData, decimalToHexadecimal(GAME_CONFIG)).current_game_id} and should be {getComponentValueStrict(contractComponents.GameTracker, decimalToHexadecimal(GAME_CONFIG)).count}</h3>
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => {printEntitiesOfClientdata()}}>Query Check everthing</div>
          <div className="content-holder">
            <h3>There are currently {clientCameraArray.length} camera entity (1) </h3>
            <h3>There are currently {clientClickArray.length} click entity (1) </h3>
            <h3>There are currently {clientGameArray.length} client game (1) </h3>
            <h3>There are currently {clientOutpostArray.length} client outpost data  (~{gameEntityTracker.outpost_count})</h3>
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => {createEvent()}}>Start Event</div>
          <div className="content-holder">
            <h3>There are currently {eventArray.length} events ({gameEntityTracker.event_count}) </h3>
      
          </div>
        </div>

      </div>
    </ClickWrapper>
  );
};