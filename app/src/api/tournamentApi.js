import { db } from "../configs/db";
import { /*doc,*/ addDoc, getDocs, /*updateDoc,*/ collection } from "firebase/firestore";

const tournamentApi = {};

/**
 * Enum for tracking status of the tournament.
 * @readonly
 * @enum {string}
 */
const TournamentStatus = {
  SCHEDULED: "Scheduled",
  ONGOING: "Ongoing",
  FINISHED: "Finished",
};

/**
 * Enum for specifying the type of the tournament.
 * @readonly
 * @enum {string}
 */
const TournamentType = {
  SINGLE_ELIMINATION: "Single Elimination",
  ALL_VS_ALL: "League (All versus All)",
  COMBINED: "Combined",
};

/**
 * @param {string} name         Name of the tournament
 * @param {string} creatorId    UID of the tournament's creator
 * @param {Array} teams         Array of teams attending the tournament
 * @param {TournamentType} type Type of the tournament
 * @param {boolean} isPrivate   Visibility of the tournament
 * @returns {Object}            Tournament Object
 */
function createTournamentObject(name, creatorId, teams, type, isPrivate = false) {
  return {
    name: name,
    creator: creatorId,
    teams: teams,
    status: TournamentStatus.SCHEDULED,
    type: type,
    is_private: isPrivate,
    matches: [],
    winner: "",
  };
}

tournamentApi.createTournament = async function (/*matchData, event*/) {
  // event.preventDefault();
  try {
    const newTournament = createTournamentObject(
      "second tournament (private one!!!) :)",
      "uid2",
      ["111", "222", "333", "444", "555", "666", "777", "888"],
      TournamentType.SINGLE_ELIMINATION,
      true
    );
    console.log("newTournament: ", newTournament);
    const docRef = await addDoc(collection(db, "tournaments"), newTournament);
    console.log("Tournament added with ID ", docRef.id);
  } catch (err) {
    console.log("Error while adding a tournament: ", err);
  }
};

// function generateMatchesForSingleElimination() {}
// function generateMatchesForLeague() {}


// tournamentApi.addMatchesToTournament = async function (/*matchData, event*/) {

// }

// tournamentApi.updateTournament = async function (matchId, fieldsToChange) {
//   // event.preventDefault();
//   try {
//     const matchRef = doc(db, "matches", matchId);
//     await updateDoc(matchRef, fieldsToChange);
//     console.log("Match with ID ", matchId, " changed");
//   } catch (err) {
//     console.log("Error while changing a match: ", err);
//   }
// };

tournamentApi.collectAllTournaments = async function (allTournaments) {
  allTournaments.length = 0;
  const querySnapshot = await getDocs(collection(db, "tournaments"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allTournaments.push({
      id: doc.id,
      name: data.name,
      creator: data.creator_id,
      teams: data.teams,
      status: data.status,
      type: data.type,
      is_private: data.is_private,
      matches: data.matches,
      winner: data.winner,
    });
  });
};

export default tournamentApi;
