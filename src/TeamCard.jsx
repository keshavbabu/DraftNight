import React from "react";

const TeamCard = (props) => {
  return (
    <div class="teamcard">
      <b>{props.team.name}</b>
      <br />
      {props.team.owner}
      <br />
      <br />
      {props.children}
    </div>
  );
};

export default TeamCard;
