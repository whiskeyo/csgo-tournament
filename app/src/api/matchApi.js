import { db } from "../configs/db";
import { doc, addDoc, getDocs, updateDoc, collection } from "firebase/firestore";

const matchApi = {};

const MatchType = {
  BO1: 1,
  BO3: 3,
  BO5: 5,
};

/**
 * @param {Object} matchType Object with specified match types (B01, BO3, BO5)
 * @returns {number}         Corresponding matchType number in DB
 */
// function convertMatchTypeToNumber(matchType) {
//   return MatchType[matchType];
// }

// function convertNumberToMatchType(matchTypeNumber) {
//   return Object.keys(MatchType).find((key) => object[key] === matchTypeNumber);
// }

/**
 * @param {number} firstTeamScore  Score of the first team
 * @param {number} secondTeamScore Score of the second team
 * @param {number} roundsWonByCt   Rounds won by both teams when on CT side
 * @param {number} roundsWonByT    Rounds won by both teams when on T side
 * @returns {Object}               Score Object
 */
matchApi.createScoreObject = function(firstTeamScore, secondTeamScore, roundsWonByCt, roundsWonByT) {
  return {
    first_team_score: firstTeamScore,
    second_team_score: secondTeamScore,
    rounds_won_by_ct: roundsWonByCt,
    rounds_won_by_t: roundsWonByT,
  };
}

/**
 * @param {string} firstTeam     ID of the first team
 * @param {string} secondTeam    ID of the second team
 * @param {MatchType} matchType  Type of the match (BO1, BO3, BO5)
 * @param {Array}  maps          Maps selected by both teams
 * @returns {Object}             Match Object
 */
function createMatchObject(firstTeam, secondTeam, matchType, maps) {
  return {
    first_team: firstTeam,
    second_team: secondTeam,
    match_type: matchType,
    maps: maps,
    scores: [],
    winner: "",
  };
}

matchApi.createMatch = async function (/*matchData, event*/) {
  // event.preventDefault();
  try {
    const newMatch = createMatchObject("test3", "test4", MatchType.BO5, [
      "Mirage",
      "Dust 2",
      "Inferno",
      "Ancient",
      "Nuke",
    ]);
    console.log("newMatch: ", newMatch);
    const docRef = await addDoc(collection(db, "matches"), newMatch);
    console.log("Match added with ID ", docRef.id);
  } catch (err) {
    console.log("Error while adding a match: ", err);
  }
};

matchApi.updateMatch = async function (matchId, fieldsToChange) {
  // event.preventDefault();
  try {
    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, fieldsToChange);
    console.log("Match with ID ", matchId, " changed");
  } catch (err) {
    console.log("Error while changing a match: ", err);
  }
};


matchApi.collectAllMatches = async function (allMatches) {
  allMatches.length = 0;
  const querySnapshot = await getDocs(collection(db, "matches"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allMatches.push({
      first_team: data.first_team,
      second_team: data.second_team,
      match_type: data.match_type,
      maps: data.maps,
      scores: data.scores,
      winner: data.winner,
      id: doc.id,
    });
  });
};

export default matchApi;
