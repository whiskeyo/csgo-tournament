/** @namespace tournamentApi */

import { db } from "../configs/db";
import { /*doc,*/ addDoc, getDocs, /*updateDoc,*/ collection, where, query } from "firebase/firestore";
import types from "../services/types";
import objectGenerators from "../services/objectGenerators";
import matchApi from "../api/matchApi";

const tournamentApi = {};

tournamentApi.createTournament = async function (/*matchData, event*/) {
  // event.preventDefault();
  try {
    let teams = ["A", "B", "C", "D", "E", "F", "G", "H"];
    let matchType = types.MatchType.BO1;

    const newTournament = objectGenerators.createTournamentObjectWithoutMatches(
      "third tournament",
      "uidsdasdasda2",
      teams,
      types.TournamentType.SINGLE_ELIMINATION,
      matchType,
      true
    );

    let matches = objectGenerators.createSingleEliminationMatches(teams, matchType);
    console.log("matches: ", matches);
    let createMatchPromises = [];
    matches.forEach((match) => {
      createMatchPromises.push(matchApi.createMatch(match.first_team, match.second_team, match.match_type));
    });
    let matchesIds = [];
    Promise.all(createMatchPromises).then((returnedMatchesIds) => {
      returnedMatchesIds.forEach((matchId) => {
        matchesIds.push(matchId);
      });
      console.log("matchesIds: ", matchesIds);
      objectGenerators.setMatchesIdsToTournamentObject(newTournament, matchesIds);
    });

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

// TODO: get this to work...........................................
tournamentApi.collectTournamentsPlayedByTeam = async function (teamId, tournamentsPlayed) {
  console.log("collectTournamentsPlayedByTeam", teamId, "and typeof teamId is", typeof teamId);
  // const tournaments = query(collection(db, "tournaments"), where("name", "==", "fisrt tournament :)"));
  const tournaments = query(collection(db, "tournaments"), where("teams", "array-contains", teamId));
  const tournamentsSnapshot = await getDocs(tournaments);
  console.log("is tournamentsSnapshot empty: ", tournamentsSnapshot.empty);
  tournamentsSnapshot.forEach((doc) => {
    tournamentsPlayed.push({
      id: doc.id,
      name: doc.data().name,
    });
  });
};

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
