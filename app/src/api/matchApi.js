import { db } from "../configs/db";
import { doc, addDoc, getDocs, updateDoc, collection } from "firebase/firestore";

const matchApi = {};

matchApi.MatchType = {
  BO1: 1,
  BO3: 3,
  BO5: 5,
};

/**
 * @param {string} firstTeam     ID of the first team
 * @param {string} secondTeam    ID of the second team
 * @param {MatchType} matchType  Type of the match (BO1, BO3, BO5)
 * @param {Array}  maps          Maps selected by both teams
 * @returns {Object}             Match Object
 */
matchApi.createMatchObject = function (firstTeam, secondTeam, matchType, maps) {
  return {
    first_team: firstTeam,
    second_team: secondTeam,
    match_type: matchType,
    maps: maps,
    scores: [],
    winner: "",
  };
};

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
