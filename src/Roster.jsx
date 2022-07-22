import React from "react";
import PlayerCard from "./PlayerCard";
import { fixPosition } from "./App";

const Roster = (props) => {
  return (
    <>
      <div class="positionsection border">
        <div class="position">QB</div>
        <div class="players">
          {props.team.positions[0].players.map((player) => {
            return (
              <div key={player.POS}>
                <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      </div>
      <div class="positionsection border">
        <div class="position">RB</div>
        <div class="players">
          {props.team.positions[1].players.map((player) => {
            return (
              <div key={player.POS}>
                <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      </div>
      <div class="positionsection border">
        <div class="position">WR</div>
        <div class="players">
          {props.team.positions[2].players.map((player) => {
            return (
              <div key={player.POS}>
                <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      </div>
      <div class="positionsection border">
        <div class="position">TE</div>
        <div class="players">
          {props.team.positions[3].players.map((player) => {
            return (
              <div key={player.POS}>
                <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      </div>
      <div class="positionsection border">
        <div class="position">Flex</div>
        <div class="players">
          {props.team.positions[4].players.map((player) => {
            return (
              <div key={player.POS}>
                <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      </div>
      <div class="positionsection border">
        <div class="position">K</div>
        <div class="players">
          {props.team.positions[5].players.map((player) => {
            return (
              <div key={player.POS}>
                <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      </div>
      <div class="positionsection border">
        <div class="position">Defense</div>
        <div class="players">
          {props.team.positions[6].players.map((player) => {
            return (
              <div key={player.POS}>
                <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      </div>
      <div class="positionsection border">
        <div class="position">Bench</div>
        <div class="players">
          {props.team.positions[7].players.map((player) => {
            return (
              <div key={player.POS}>
                {fixPosition(player.POS)} <PlayerCard player={player} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Roster;
