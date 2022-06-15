/** @namespace tournamentApi */

import { db } from "../configs/db";
import { doc, addDoc, getDoc, getDocs, updateDoc, collection, where, query } from "firebase/firestore";
import objectGenerators from "../services/objectGenerators";
import matchApi from "../api/matchApi";
import utils from "../services/utils";
// import types from "../services/types";

const tournamentApi = {};

tournamentApi.createSingleEliminationTournament = async function (tournamentData, router) {
  try {
    let matches = objectGenerators.createSingleEliminationMatches(tournamentData.teams, tournamentData.matchType);
    let createMatchPromises = [];
    matches.forEach((match) => {
      createMatchPromises.push(
        matchApi.createMatch(match.first_team, match.second_team, match.match_type, match.next_match_index)
      );
    });
    const matchesIds = [];
    console.log("going to Promise.all(createMatchPromises)");
    Promise.all(createMatchPromises)
      .then(async (returnedMatchesIds) => {
        returnedMatchesIds.forEach((matchId) => {
          console.log("creating matchesIds array");
          matchesIds.push(matchId);
        });
      })
      .then(() => {
        console.log("matchesIds.length = ", matchesIds.length);
        let updateMatchWithNextMatchIdPromises = [];
        const numberOfTeams = tournamentData.teams.length;
        for (let idx = 0; idx < matchesIds.length; ++idx) {
          const nextMatchIdx = utils.calculateNextMatchIndex(idx, numberOfTeams);
          if (nextMatchIdx != -1)
            /* final -> no next match */
            updateMatchWithNextMatchIdPromises.push(
              matchApi.updateMatch(matchesIds[idx], {
                current_match_index: idx,
                next_match_index: nextMatchIdx,
                next_match_id: matchesIds[nextMatchIdx],
                last_match_index: matchesIds.length - 1,
              })
            );
        }
        Promise.all(updateMatchWithNextMatchIdPromises);
      })
      .then(() => {
        const newTournament = objectGenerators.createTournamentObjectWithMatches(
          tournamentData.name,
          tournamentData.creator,
          tournamentData.teams,
          matchesIds,
          tournamentData.type,
          tournamentData.matchType,
          tournamentData.isPrivate
        );
        addDoc(collection(db, "tournaments"), newTournament).then((docRef) => {
          console.log("Tournament (single elimination) added with ID ", docRef.id);
          router.push("/tournament/" + docRef.id);
          return docRef.id;
        });
      });
  } catch (err) {
    console.log("Tournament not added -- err -- ", err);
  }
};

tournamentApi.createAllVsAllTournament = async function (tournamentData, router) {
  try {
    let matches = objectGenerators.createRoundRobinMatches(tournamentData.teams, tournamentData.matchType);
    let createMatchPromises = [];
    matches.forEach((match) => {
      createMatchPromises.push(
        matchApi.createMatch(match.first_team, match.second_team, match.match_type, match.next_match_index)
      );
    });
    const matchesIds = [];
    console.log("going to Promise.all(createMatchPromises)");
    Promise.all(createMatchPromises)
      .then(async (returnedMatchesIds) => {
        returnedMatchesIds.forEach((matchId) => {
          console.log("creating matchesIds array");
          matchesIds.push(matchId);
        });
      })
      .then(() => {
        const newTournament = objectGenerators.createTournamentObjectWithMatches(
          tournamentData.name,
          tournamentData.creator,
          tournamentData.teams,
          matchesIds,
          tournamentData.type,
          tournamentData.matchType,
          tournamentData.isPrivate
        );
        addDoc(collection(db, "tournaments"), newTournament).then((docRef) => {
          console.log("Tournament (all vs all) added with ID ", docRef.id);
          router.push("/tournament/" + docRef.id);
          return docRef.id;
        });
      });
  } catch (err) {
    console.log("Tournament not added -- err -- ", err);
  }
};

tournamentApi.createCombinedTournament = async function (tournamentData) {
  tournamentData;
};

tournamentApi.collectTournamentsPlayedByTeam = async function (teamId, tournamentsPlayed) {
  console.log("collectTournamentsPlayedByTeam", teamId, "and typeof teamId is", typeof teamId);
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

tournamentApi.collectTournamentByID = async function (tournamentId, tournamentDetails) {
  console.log("tournamentId: ", tournamentId);
  const tournamentRef = doc(db, "tournaments", tournamentId);
  const tournamentDoc = await getDoc(tournamentRef);
  if (tournamentDoc.exists()) {
    console.log("data: ", tournamentDoc.data());
    tournamentDetails.id = tournamentDoc.id;
    tournamentDetails.name = tournamentDoc.data().name;
    tournamentDetails.creatorId = tournamentDoc.data().creator;
    tournamentDetails.matchesId = tournamentDoc.data().matches;
    tournamentDetails.teamsId = tournamentDoc.data().teams;
    tournamentDetails.matchType = tournamentDoc.data().match_type;
    tournamentDetails.type = tournamentDoc.data().type;
    tournamentDetails.status = tournamentDoc.data().status;
    tournamentDetails.winner = tournamentDoc.data().winner;
  } else {
    console.log("document does not exist");
  }
};

tournamentApi.collectAllTournaments = async function (allTournaments) {
  allTournaments.length = 0;
  const querySnapshot = await getDocs(collection(db, "tournaments"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allTournaments.push({
      id: doc.id,
      name: data.name,
      creator: data.creator,
      teamsId: data.teams,
      status: data.status,
      type: data.type,
      is_private: data.is_private,
      matches: data.matches,
      winner: data.winner,
    });
  });
};

tournamentApi.updateTournament = async function (tournamentId, fieldsToChange) {
  try {
    const tournamentRef = doc(db, "tournaments", tournamentId);
    await updateDoc(tournamentRef, fieldsToChange);
    console.log("Tournament with ID ", tournamentId, " changed");
  } catch (err) {
    console.log("Error while changing a tournament: ", err);
  }
};

export default tournamentApi;
