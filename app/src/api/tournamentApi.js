/** @namespace tournamentApi */

import { db } from "../configs/db";
import { doc, addDoc, getDoc, getDocs, updateDoc, collection, where, query } from "firebase/firestore";
import objectGenerators from "../services/objectGenerators";
import matchApi from "../api/matchApi";
import utils from "../services/utils";
import types from "../services/types";

const tournamentApi = {};

/**
 * @method
 * @param {Object} tournamentData Object with Single Elimination tournament data to be saved in DB
 * @param {Object} router         Vue-router instance used for redirection to newly
 *                                created Single Elimination tournament
 */
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
    Promise.all(createMatchPromises)
      .then(async (returnedMatchesIds) => {
        returnedMatchesIds.forEach((matchId) => {
          matchesIds.push(matchId);
        });
      })
      .then(() => {
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
          types.TournamentType.SINGLE_ELIMINATION,
          tournamentData.matchType,
          tournamentData.isPrivate
        );
        addDoc(collection(db, "tournaments"), newTournament).then((docRef) => {
          router.push("/tournament/" + docRef.id);
          return docRef.id;
        });
      });
  } catch (err) {
    console.log("Tournament not added -- err -- ", err);
  }
};

/**
 * @method
 * @param {Object} tournamentData Object with All vs. All tournament data to be saved in DB
 * @param {Object} router         Vue-router instance used for redirection to newly
 *                                created All vs. All tournament
 */
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
    Promise.all(createMatchPromises)
      .then(async (returnedMatchesIds) => {
        returnedMatchesIds.forEach((matchId) => {
          matchesIds.push(matchId);
        });
      })
      .then(() => {
        const newTournament = objectGenerators.createTournamentObjectWithMatches(
          tournamentData.name,
          tournamentData.creator,
          tournamentData.teams,
          matchesIds,
          types.TournamentType.ALL_VS_ALL,
          tournamentData.matchType,
          tournamentData.isPrivate
        );
        addDoc(collection(db, "tournaments"), newTournament).then((docRef) => {
          router.push("/tournament/" + docRef.id);
          return docRef.id;
        });
      });
  } catch (err) {
    console.log("Tournament not added -- err -- ", err);
  }
};

/**
 * @method
 * @param {Object} tournamentData Object with Combined tournament data to be saved in DB
 * @param {Object} router         Vue-router instance used for redirection to newly
 *                                created Combined tournament
 */
tournamentApi.createCombinedTournament = async function (tournamentData, router) {
  try {
    const matches = objectGenerators.createCombinedMatches(tournamentData.teams, tournamentData.matchType);

    let createMatchPromises = [];
    matches.forEach((match) => {
      createMatchPromises.push(
        matchApi.createMatch(match.first_team, match.second_team, match.match_type, match.next_match_index)
      );
    });

    const matchesIds = [];
    Promise.all(createMatchPromises)
      .then(async (returnedMatchesIds) => {
        returnedMatchesIds.forEach((matchId) => {
          matchesIds.push(matchId);
        });
      })
      .then(() => {
        let updateMatchWithNextMatchIdPromises = [];
        const numberOfGroupMatches = 6 * (tournamentData.teams.length / 4);
        const numberOfTeamsAfterGroupStage = tournamentData.teams.length / 2;
        const numberOfSingleEliminationMatches = matches.length - numberOfGroupMatches;
        for (let idx = 0; idx < numberOfSingleEliminationMatches; ++idx) {
          const nextMatchIdx = utils.calculateNextMatchIndex(idx, numberOfTeamsAfterGroupStage);
          if (nextMatchIdx != -1) {
            /* final -> no next match */
            updateMatchWithNextMatchIdPromises.push(
              matchApi.updateMatch(matchesIds[idx + numberOfGroupMatches], {
                current_match_index: idx + numberOfGroupMatches,
                next_match_index: nextMatchIdx + numberOfGroupMatches,
                next_match_id: matchesIds[nextMatchIdx + numberOfGroupMatches],
                last_match_index: matchesIds.length - 1,
              })
            );
          }
        }
        Promise.all(updateMatchWithNextMatchIdPromises);
      })
      .then(() => {
        const newTournament = objectGenerators.createTournamentObjectWithMatches(
          tournamentData.name,
          tournamentData.creator,
          tournamentData.teams,
          matchesIds,
          types.TournamentType.COMBINED,
          tournamentData.matchType,
          tournamentData.isPrivate
        );
        addDoc(collection(db, "tournaments"), newTournament).then((docRef) => {
          router.push("/tournament/" + docRef.id);
          return docRef.id;
        });
      });
  } catch (err) {
    console.log("Tournament not added -- err -- ", err);
  }
};

/**
 * @method
 * @param {string} teamId ID of the team to have collected all attended tournaments
 * @returns {Array}       Array of all tournaments attended by team with given ID
 */
tournamentApi.getTournamentsPlayedByTeam = async function (teamId) {
  let tournamentsPlayed = [];
  const tournaments = query(collection(db, "tournaments"), where("teams", "array-contains", teamId));
  const tournamentsSnapshot = await getDocs(tournaments);
  tournamentsSnapshot.forEach((doc) => {
    tournamentsPlayed.push({
      id: doc.id,
      name: doc.data().name,
      winner: doc.data().winner,
    });
  });
  return tournamentsPlayed;
};

/**
 * @method
 * @param {string} teamId           ID of the team to have collected all attended tournaments
 * @param {Array} tournamentsPlayed Array to be filled with all tournaments attended by team with given ID
 */
tournamentApi.collectTournamentsPlayedByTeam = async function (teamId, tournamentsPlayed) {
  const tournaments = query(collection(db, "tournaments"), where("teams", "array-contains", teamId));
  const tournamentsSnapshot = await getDocs(tournaments);
  tournamentsSnapshot.forEach((doc) => {
    tournamentsPlayed.push({
      id: doc.id,
      name: doc.data().name,
      winner: doc.data().winner,
    });
  });
};

/**
 * @method
 * @param {string} tournamentId      ID of the tournament to have collected its data
 * @param {Object} tournamentDetails Object with the tournament data stored in DB
 */
tournamentApi.collectTournamentByID = async function (tournamentId, tournamentDetails) {
  const tournamentRef = doc(db, "tournaments", tournamentId);
  const tournamentDoc = await getDoc(tournamentRef);
  if (tournamentDoc.exists()) {
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
    console.log("Document " + tournamentId + " does not exist");
  }
};

/**
 * @method
 * @param {Array} allTournaments Array in which all tournaments from DB are saved
 */
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

/**
 * @method
 * @param {string} tournamentId   ID of the tournament to be updated
 * @param {Object} fieldsToChange Object contating fields that are updated
 */
tournamentApi.updateTournament = async function (tournamentId, fieldsToChange) {
  try {
    const tournamentRef = doc(db, "tournaments", tournamentId);
    await updateDoc(tournamentRef, fieldsToChange);
  } catch (err) {
    console.log("Error while changing a tournament: ", err);
  }
};

export default tournamentApi;
