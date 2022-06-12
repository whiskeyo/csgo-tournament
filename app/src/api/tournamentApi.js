/** @namespace tournamentApi */

import { db } from "../configs/db";
import { doc, addDoc, getDoc, getDocs, /*updateDoc,*/ collection, where, query/*, deleteDoc*/ } from "firebase/firestore";
// import types from "../services/types";
import objectGenerators from "../services/objectGenerators";
import matchApi from "../api/matchApi";

const tournamentApi = {};

// tournamentApi.createTournament = async function (/*matchData, event*/) {
//   // event.preventDefault();
//   try {
//     let teams = ["2jyK60jI8VtymzCV70EK", "604FAoVwP1wOyQB4fubq", "Thb2wY0EzzBZLM7J6yjS", "wjO2Sl18wkHzSS89T6zv"];
//     let matchType = types.MatchType.BO1;

//     const newTournament = objectGenerators.createTournamentObjectWithoutMatches(
//       "9999999999999999999",
//       "64ZQaaTX6HShdJy2gsD4",
//       teams,
//       types.TournamentType.SINGLE_ELIMINATION,
//       matchType,
//       true
//     );

//     let matches = objectGenerators.createSingleEliminationMatches(teams, matchType);
//     console.log("matches: ", matches);
//     let createMatchPromises = [];
//     matches.forEach((match) => {
//       createMatchPromises.push(matchApi.createMatch(match.first_team, match.second_team, match.match_type));
//     });
//     const matchesIds = [];
//     Promise.all(createMatchPromises).then((returnedMatchesIds) => {
//       returnedMatchesIds.forEach((matchId) => {
//         matchesIds.push(matchId);
//       });
//       console.log("matchesIds: ", matchesIds);
//       objectGenerators.setMatchesIdsToTournamentObject(newTournament, matchesIds);
//     });

//     console.log("newTournament: ", newTournament);
//     if (matchesIds.length > 0) {
//       const docRef = await addDoc(collection(db, "tournaments"), newTournament);
//       console.log("Tournament added with ID ", docRef.id);
//     } else {
//       console.log("matches are not created yet");
//     }
//   } catch (err) {
//     console.log("Error while adding a tournament: ", err);
//   }
// };

// better
// tournamentApi.createTournament = async function (/*matchData, event*/) {
//   // event.preventDefault();
//   try {
//     let teams = ["2jyK60jI8VtymzCV70EK", "604FAoVwP1wOyQB4fubq", "Thb2wY0EzzBZLM7J6yjS", "wjO2Sl18wkHzSS89T6zv"];
//     let matchType = types.MatchType.BO1;

//     let matches = objectGenerators.createSingleEliminationMatches(teams, matchType);
//     console.log("matches: ", matches);
//     let createMatchPromises = [];
//     matches.forEach((match) => {
//       createMatchPromises.push(matchApi.createMatch(match.first_team, match.second_team, match.match_type));
//     });
//     const matchesIds = [];
//     Promise.all(createMatchPromises).then((returnedMatchesIds) => {
//       returnedMatchesIds.forEach((matchId) => {
//         matchesIds.push(matchId);
//       });
//       console.log("matchesIds: ", matchesIds);
//       // objectGenerators.setMatchesIdsToTournamentObject(newTournament, matchesIds);
//     }).then(() => {
//       const newTournament = objectGenerators.createTournamentObjectWithMatches(
//         "1010101010101010",
//         "64ZQaaTX6HShdJy2gsD4",
//         teams,
//         matchesIds,
//         types.TournamentType.SINGLE_ELIMINATION,
//         matchType,
//         true
//       );
//       console.log("newTournament: ", newTournament);
//       if (matchesIds.length > 0) {
//         const docRef = addDoc(collection(db, "tournaments"), newTournament);
//         console.log("Tournament added with ID ", docRef.id);
//       } else {
//         console.log("matches are not created yet");
//       }
//     });
//   } catch (err) {
//     console.log("Tournament not added -- err -- ", err);
//   }
// };

tournamentApi.createTournament = async function (tournamentData, event) {
  event.preventDefault();
  try {
    // let teams = ["2jyK60jI8VtymzCV70EK", "604FAoVwP1wOyQB4fubq", "Thb2wY0EzzBZLM7J6yjS", "wjO2Sl18wkHzSS89T6zv"];
    // let matchType = types.MatchType.BO1;
    console.log("creatorId: ", tournamentData.creator);
    let matches = objectGenerators.createSingleEliminationMatches(tournamentData.teams, tournamentData.matchType);
    console.log("matches: ", matches);
    let createMatchPromises = [];
    matches.forEach((match) => {
      createMatchPromises.push(matchApi.createMatch(match.first_team, match.second_team, match.match_type));
    });
    const matchesIds = [];
    Promise.all(createMatchPromises)
      .then((returnedMatchesIds) => {
        returnedMatchesIds.forEach((matchId) => {
          matchesIds.push(matchId);
        });
        console.log("matchesIds: ", matchesIds);
        // objectGenerators.setMatchesIdsToTournamentObject(newTournament, matchesIds);
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
        console.log("newTournament: ", newTournament);
        if (matchesIds.length > 0) {
          addDoc(collection(db, "tournaments"), newTournament).then((docRef) => {
            console.log("Tournament added with ID ", docRef.id);
            return docRef.id;
          });
        } else {
          console.log("matches are not created yet");
        }
      });
  } catch (err) {
    console.log("Tournament not added -- err -- ", err);
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
