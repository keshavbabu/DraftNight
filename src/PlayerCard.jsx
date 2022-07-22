import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import { fixPosition } from "./App";

import "./styles.css";

const infoModalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%"
  }
};

const PlayerCard = (props) => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  return (
    <>
      <Modal
        style={infoModalStyle}
        isOpen={infoModalOpen}
        contentLabel="Player Info"
      >
        <h1>{props.player.NAME}</h1>
        <h3>
          {props.player.POS} {props.player.TEAM}
        </h3>
        <h4>Fantasy Points: {props.player.F_PTS}</h4>
        Previous Year Stats:
        <div class="grid-container">
          <div class="grid-item">Passing Yards: {props.player.P_YDS}</div>
          <div class="grid-item">Passing TDs: {props.player.P_TDS}</div>
          <div class="grid-item">Receiving REC: {props.player.RE_REC}</div>
          <div class="grid-item">Receiving Yards: {props.player.RE_YDS}</div>
          <div class="grid-item">Receiving TDs: {props.player.RE_TDS}</div>
          <div class="grid-item">Rushing ATT: {props.player.RU_ATT}</div>
          <div class="grid-item">Rushing Yards: {props.player.RU_YDS}</div>
          <div class="grid-item">Rushing TDs: {props.player.RU_TDS}</div>
        </div>
        <div class="notes">Notes: {props.player.NOTES}</div>
        <br />
        <button onClick={() => setInfoModalOpen(false)}>close</button>
      </Modal>
      <span class="playercard">
        <button onClick={() => setInfoModalOpen(true)} class="playercardinfo">
          {props.player.NAME}
          <br />
          {props.showPosition ? <>{fixPosition(props.player.POS)} </> : <></>}
          {props.player.TEAM}
        </button>
        {props.pickable ? (
          <>
            <button
              onClick={() => {
                props.onPick(props.player);
              }}
              class="playercardpick"
            >
              pick
            </button>
          </>
        ) : (
          <></>
        )}
      </span>
    </>
  );
};

export default PlayerCard;
