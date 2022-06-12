/** @namespace matchApi */

import { db } from "../configs/db";
import { doc, addDoc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import objectGenerators from "../services/objectGenerators";

const matchApi = {};

/**
 * @param {string} firstTeam     ID of the first team
 * @param {string} secondTeam    ID of the second team
 * @param {types.MatchType} matchType  Type of the match (BO1, BO3, BO5)
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

matchApi.createMatch = async function (firstTeam, secondTeam, matchType) {
  // event.preventDefault();
  try {
    const newMatch = objectGenerators.createMatchObject(firstTeam, secondTeam, matchType);
    const docRef = await addDoc(collection(db, "matches"), newMatch);
    console.log("Match added with ID ", docRef.id);
    return docRef.id;
  } catch (err) {
    console.log("Error while adding a match: ", err);
    return "";
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

matchApi.getMatchByID = async function (matchId) {
  console.log("matchId: ", matchId);
  const matchRef = doc(db, "matches", matchId);
  const matchDoc = await getDoc(matchRef);
  if (matchDoc.exists()) {
    console.log("matchDoc.data(): ", matchDoc.data());
    return {
      id: matchDoc.id,
      firstTeam: matchDoc.data().first_team,
      secondTeam: matchDoc.data().second_team,
      matchType: matchDoc.data().match_type,
      maps: matchDoc.data().maps,
      mapsBanned: matchDoc.data().maps_banned,
      scores: matchDoc.data().scores,
      winner: matchDoc.data().winner,
    }
  } else {
    console.log("document does not exist");
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
