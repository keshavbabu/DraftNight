import { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";
import Modal from "react-modal";
import Roster from "./Roster";
import * as xlsx from "xlsx";

import "./styles.css";
import TeamCard from "./TeamCard";

const firstStartModalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

export const fixPosition = (position) => {
  return position.replace(/[0-9]/g, "");
};

const App = () => {
  const [teams, setTeams] = useState([]);
  const [picking, setPicking] = useState(0);
  const [round, setRound] = useState(0);
  const [players, setPlayers] = useState([]);
  const [forwards, setForwards] = useState(true);
  const [repeated, setRepeated] = useState(false);
  const [done, setDone] = useState(false);

  const [firstStartModalOpen, setFirstStartModalOpen] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [positionAmounts, setPositionAmounts] = useState([
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1
  ]);
  const [teamSize, setTeamSize] = useState(
    positionAmounts.reduce((pv, cv) => pv + cv, 0)
  );
  const [search, setSearch] = useState("");

  const addTeam = () => {
    if (teamName != "" && ownerName != "") {
      var copy = [...teams];
      var obj = new Object();
      obj.name = teamName;
      obj.owner = ownerName;
      obj.players = 0;
      var qbs = new Object();
      qbs.players = [];
      var rbs = new Object();
      rbs.players = [];
      var wrs = new Object();
      wrs.players = [];
      var tes = new Object();
      tes.players = [];
      var flexs = new Object();
      flexs.players = [];
      var ks = new Object();
      ks.players = [];
      var ds = new Object();
      ds.players = [];
      var bs = new Object();
      bs.players = [];
      obj.positions = [qbs, rbs, wrs, tes, flexs, ks, ds, bs];
      copy.push(obj);
      setTeams(copy);
      setTeamName("");
      setOwnerName("");
    }
  };

  function isNumeric(str) {
    if (typeof str == "number") return true; // we only process strings!
    if (typeof str != "string") return false;
    return (
      !isNaN(str) && !isNaN(parseFloat(str)) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    ); // ...and ensure strings of whitespace fail
  }

  const closeFirstStartModal = () => {
    //console.log(isNumeric(teamSize));
    if (isNumeric(teamSize) && teams.length > 1) {
      //getPlayers();
      setFirstStartModalOpen(false);
    }
  };
  useEffect(() => {
    // animation when the draft is over
    console.log(positionAmounts.reduce((pv, cv) => pv + cv, 0));
  }, [positionAmounts]);

  const exportData = () => {
    // export the teams and the players
    alert(JSON.stringify(teams));
  };

  const pick = (player) => {
    var position = fixPosition(player.POS);
    var copy = [...teams];
    if (
      position == "QB" &&
      copy[picking].positions[0].players.length < positionAmounts[0]
    ) {
      copy[picking].positions[0].players.push(player);
      console.log("pushed QB");
    } else if (
      position == "RB" &&
      copy[picking].positions[1].players.length < positionAmounts[1]
    ) {
      copy[picking].positions[1].players.push(player);
      console.log("pushed RB");
    } else if (
      position == "WR" &&
      copy[picking].positions[2].players.length < positionAmounts[2]
    ) {
      copy[picking].positions[2].players.push(player);
      console.log("pushed WR");
    } else if (
      position == "TE" &&
      copy[picking].positions[3].players.length < positionAmounts[3]
    ) {
      copy[picking].positions[3].players.push(player);
      console.log("pushed TE");
    } else if (
      (position == "RB" || position == "WR" || position == "TE") &&
      copy[picking].positions[4].players.length < positionAmounts[4]
    ) {
      copy[picking].positions[4].players.push(player);
      console.log("pushed Flex");
    } else if (
      position == "K" &&
      copy[picking].positions[5].players.length < positionAmounts[5]
    ) {
      copy[picking].positions[5].players.push(player);
      console.log("pushed K");
    } else if (
      position == "DST" &&
      copy[picking].positions[6].players.length < positionAmounts[6]
    ) {
      copy[picking].positions[6].players.push(player);
      console.log("Pushed DST");
    } else if (copy[picking].positions[7].players.length < positionAmounts[7]) {
      copy[picking].positions[7].players.push(player);
      //console.log(JSON.stringify(copy[picking]));
      console.log("Pushed Bench");
    } else {
      console.log("no space");
      //pick not valid
      return;
    }
    copy[picking].players += 1;
    setTeams(copy);
    copy = players.slice();
    for (let [i, playeri] of copy.entries()) {
      if (playeri.NAME === player.NAME) {
        copy.splice(i, 1);
      }
    }
    setPlayers(copy);
    nextTeam();
  };

  const nextTeam = () => {
    if (teams[picking].players == teamSize) {
      var tmp = teams.every(function (e) {
        return e.players == teamSize;
      });
      if (tmp) {
        setDone(tmp);
        return;
      }
    }
    var next = 0;
    if (forwards) {
      var length = teams.length - 1;
      next = picking + 1;
      if (next <= length) {
        //console.log("all good");
        setPicking(picking + 1);
      } else if (!repeated) {
        //console.log("repeating");
        setRound(round + 1);
        setRepeated(true);
      } else if (repeated) {
        //console.log("snaking back");
        setRepeated(false);
        setForwards(false);
        setPicking(picking - 1);
      }
    } else {
      next = picking - 1;
      if (next >= 0) {
        //console.log("all good");
        setPicking(picking - 1);
      } else if (!repeated) {
        //console.log("repeating");
        setRound(round + 1);
        setRepeated(true);
      } else if (repeated) {
        //console.log("snaking back");
        setRepeated(false);
        setForwards(true);
        setPicking(picking + 1);
      }
    }
  };

  const getPlayers = async () => {
    await fetch("./players.json")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
      });
    setRound(1);
  };

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setPlayers(json);
        setRound(1);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  /*
  const getTeams = async () => {
    await fetch("./teams.json")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
      });
  };
  */

  return (
    <>
      <body>
        <Modal
          style={firstStartModalStyle}
          isOpen={firstStartModalOpen}
          contentLabel="Start Settings"
        >
          Roster Spots: {teamSize}
          <br />
          QBs:
          <input
            value={positionAmounts[0]}
            onInput={(e) => {
              var copy = [...positionAmounts];
              copy[0] = parseFloat(e.target.value);
              setPositionAmounts(copy);
              setTeamSize(copy.reduce((pv, cv) => pv + cv, 0));
            }}
            type="number"
          ></input>
          <br />
          RBs:
          <input
            value={positionAmounts[1]}
            onInput={(e) => {
              var copy = [...positionAmounts];
              copy[1] = parseFloat(e.target.value);
              setPositionAmounts(copy);
              setTeamSize(copy.reduce((pv, cv) => pv + cv, 0));
            }}
            type="number"
          ></input>
          <br />
          WRs:
          <input
            value={positionAmounts[2]}
            onInput={(e) => {
              var copy = [...positionAmounts];
              copy[2] = parseFloat(e.target.value);
              setPositionAmounts(copy);
              setTeamSize(copy.reduce((pv, cv) => pv + cv, 0));
            }}
            type="number"
          ></input>
          <br />
          TEs:
          <input
            value={positionAmounts[3]}
            onInput={(e) => {
              var copy = [...positionAmounts];
              copy[3] = parseFloat(e.target.value);
              setPositionAmounts(copy);
              setTeamSize(copy.reduce((pv, cv) => pv + cv, 0));
            }}
            type="number"
          ></input>
          <br />
          Flexs:
          <input
            value={positionAmounts[4]}
            onInput={(e) => {
              var copy = [...positionAmounts];
              copy[4] = parseFloat(e.target.value);
              setPositionAmounts(copy);
              setTeamSize(copy.reduce((pv, cv) => pv + cv, 0));
            }}
            type="number"
          ></input>
          <br />
          Ks:
          <input
            value={positionAmounts[5]}
            onInput={(e) => {
              var copy = [...positionAmounts];
              copy[5] = parseFloat(e.target.value);
              setPositionAmounts(copy);
              setTeamSize(copy.reduce((pv, cv) => pv + cv, 0));
            }}
            type="number"
          ></input>
          <br />
          Defenses:
          <input
            value={positionAmounts[6]}
            onInput={(e) => {
              var copy = [...positionAmounts];
              copy[6] = parseFloat(e.target.value);
              setPositionAmounts(copy);
              setTeamSize(copy.reduce((pv, cv) => pv + cv, 0));
            }}
            type="number"
          ></input>
          <br />
          Benches:
          <input
            value={positionAmounts[7]}
            onInput={(e) => {
              var copy = [...positionAmounts];
              copy[7] = parseFloat(e.target.value);
              setPositionAmounts(copy);
              setTeamSize(copy.reduce((pv, cv) => pv + cv, 0));
            }}
            type="number"
          ></input>
          <br />
          <div class="border">
            {teams.length > 0 ? (
              <>
                {teams.map((team) => {
                  return (
                    <div key={team}>
                      <TeamCard team={team} />
                    </div>
                  );
                })}
              </>
            ) : (
              <>Add Teams to Continue</>
            )}
          </div>
          <input
            value={teamName}
            onInput={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
          ></input>
          <input
            value={ownerName}
            onInput={(e) => setOwnerName(e.target.value)}
            placeholder="Owner's Name"
          ></input>
          <button onClick={addTeam}>Add Team</button>
          <br />
          <button onClick={closeFirstStartModal}>Start Draft</button>
          <form>
            <label htmlFor="upload">Upload Player Dataset:</label>
            <input
              type="file"
              name="upload"
              id="upload"
              onChange={readUploadFile}
            />
          </form>
        </Modal>
        <div>Round: {round}</div>
        <div class="layoutgrid">
          <div class="leftbar">
            <div class="teamsheader">
              {teams.length > 0 ? (
                <TeamCard team={teams[picking]} />
              ) : (
                <>No Teams</>
              )}
            </div>
            {done ? (
              <>
                <button
                  onClick={() => {
                    exportData();
                  }}
                >
                  export
                </button>
              </>
            ) : (
              <>
                <br />
              </>
            )}
            {!done ? (
              <>
                <input
                  value={search}
                  onInput={(e) => setSearch(e.target.value)}
                  placeholder="Search Players"
                  class="searchplayers"
                ></input>
              </>
            ) : (
              <></>
            )}
            <div class="playerlist" key={search.length}>
              {players.length > 0 ? (
                <div>
                  {players.map((player) => {
                    if (
                      search == "" ||
                      player.NAME.toLowerCase().includes(search.toLowerCase())
                    ) {
                      return (
                        <div key={player}>
                          <div class="players">
                            <PlayerCard
                              player={player}
                              showPosition={true}
                              pickable={!done}
                              onPick={pick}
                            />
                          </div>
                        </div>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </div>
              ) : (
                <div>No Players</div>
              )}
            </div>
          </div>
          <div class="teamlist">
            {teams.length > 0 ? (
              <div class="teamlayout">
                {teams.map((team) => {
                  return (
                    <>
                      <TeamCard team={team}>
                        Roster:
                        <Roster team={team} />
                      </TeamCard>
                    </>
                  );
                })}
              </div>
            ) : (
              <>No Teams</>
            )}
          </div>
        </div>
      </body>
    </>
  );
};

export default App;
