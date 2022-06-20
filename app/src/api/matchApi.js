/** @namespace matchApi */

import { db } from "../configs/db";
import { doc, addDoc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import objectGenerators from "../services/objectGenerators";

const matchApi = {};

/**
 * @method
 * @param {string} firstTeam          ID of the first team
 * @param {string} secondTeam         ID of the second team
 * @param {types.MatchType} matchType Type of the match (B01/B03/B05)
 * @param {Number} nextMatchIdx       Index of the next match played
 * @returns {string}                  ID of the created match
 */
matchApi.createMatch = async function (firstTeam, secondTeam, matchType, nextMatchIdx) {
  try {
    const newMatch = objectGenerators.createMatchObject(firstTeam, secondTeam, matchType, nextMatchIdx);
    const docRef = await addDoc(collection(db, "matches"), newMatch);
    return docRef.id;
  } catch (err) {
    console.log("Error while adding a match: ", err);
    return "";
  }
};

/**
 * @method
 * @param {string} matchId        ID of the match to be updated
 * @param {Object} fieldsToChange Object contating fields that are updated
 */
matchApi.updateMatch = async function (matchId, fieldsToChange) {
  try {
    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, fieldsToChange);
  } catch (err) {
    console.log("Error while changing a match: ", err);
  }
};

/**
 * @method
 * @param {string} matchId ID of the match to have collected its data
 * @returns {Object}       Object with the match data stored in DB
 */
matchApi.getMatchByID = async function (matchId) {
  const matchRef = doc(db, "matches", matchId);
  const matchDoc = await getDoc(matchRef);
  if (matchDoc.exists()) {
    return {
      id: matchDoc.id,
      firstTeam: matchDoc.data().first_team,
      secondTeam: matchDoc.data().second_team,
      matchType: matchDoc.data().match_type,
      maps: matchDoc.data().maps,
      mapsBanned: matchDoc.data().maps_banned,
      scores: matchDoc.data().scores,
      firstTeamMapWins: matchDoc.data().first_team_map_wins,
      secondTeamMapWins: matchDoc.data().second_team_map_wins,
      winner: matchDoc.data().winner,
      currentMatchIndex: matchDoc.data().current_match_index,
      lastMatchIndex: matchDoc.data().last_match_index,
      nextMatchId: matchDoc.data().next_match_id,
    }
  } else {
    console.log("Document " + matchId + " does not exist");
  }
};

/**
 * @method
 * @param {Array} allMatches Array in which all matches from DB are saved
 */
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
