/** @namespace objectGenerators */

import types from "./types";
import utils from "./utils";
import robin from "roundrobin";

const objectGenerators = {};

/**
 * @method
 * @param {string} mapName Name of the map
 * @returns {Object}       Object containing empty fields for statistics of matches played on the map
 */
objectGenerators.createMapObject = function (mapName) {
  return {
    name: mapName,
    rounds_won_by_ct: 0,
    rounds_won_by_t: 0,
    matches_played: 0,
  };
};

/**
 * @method
 * @returns {Object} Object containing null fields for a single map of the match
 */
objectGenerators.createScoreObject = function () {
  return {
    first_team_score: null,
    second_team_score: null,
    rounds_won_by_ct: null,
    rounds_won_by_t: null,
    winner: "",
  };
};

/**
 * @method
 * @param {string} firstTeam          ID of the first team
 * @param {string} secondTeam         ID of the second team
 * @param {types.MatchType} matchType Type of the match (BO1, BO3, BO5)
 * @returns {Object}                  Match object
 */
objectGenerators.createMatchObject = function (firstTeam, secondTeam, matchType) {
  return {
    first_team: firstTeam,
    second_team: secondTeam,
    match_type: matchType,
    maps: [],
    maps_banned: [],
    scores: [],
    first_team_map_wins: 0,
    second_team_map_wins: 0,
    winner: "",
  };
};

/**
 * @method
 * @param {Array} teams               Array of teams' IDs
 * @param {types.MatchType} matchType Type of the match (BO1, BO3, BO5)
 * @returns {Array}                   Array of Match objects to be played in Single Elimination Tournament,
 *                                    consisting of teams.length filled matches and `(teams.length / 2) - 1` slots
 */
objectGenerators.createSingleEliminationMatches = function (teams, matchType) {
  const matches = [];
  /* fill first round */
  for (let idx = 0; idx < teams.length / 2; ++idx) {
    matches.push(this.createMatchObject(teams[idx], teams[teams.length - 1 - idx], matchType));
  }

  /* fill other rounds */
  matches.length = teams.length - 1;
  matches.fill(this.createMatchObject("", "", matchType), teams.length / 2, teams.length - 1);

  return matches;
};

/**
 * @method
 * @param {Array} teams               Array of teams' IDs
 * @param {types.MatchType} matchType Type of the match (BO1, BO3, BO5)
 * @returns {Array}                   Array of Match objects to be played in League (All vs All)
 */
objectGenerators.createRoundRobinMatches = function (teams, matchType) {
  let rounds = robin(teams.length, teams);
  let matchesPairs = rounds.flat();
  const matches = [];
  for (let idx = 0; idx < matchesPairs.length; ++idx) {
    matches.push(this.createMatchObject(matchesPairs[idx][0], matchesPairs[idx][1], matchType));
  }

  return matches;
};

/**
 * @method
 * @param {Array} teams               Array of teams' IDs
 * @param {types.MatchType} matchType Type of the match (BO1, BO3, BO5)
 * @returns {Array}                   Array of Match objects to be played first in League system with
 *                                    splitting teams into groups of 4, and then in Single Elimination
 */
objectGenerators.createCombinedMatches = function (teams, matchType) {
  let shuffledTeams = teams;
  utils.shuffleArray(shuffledTeams);

  let matches = [];
  /* create group matches, flatten results to get array of matches */
  for (let i = 0; i < shuffledTeams.length / 4; ++i) {
    matches.push(
      ...objectGenerators.createRoundRobinMatches(shuffledTeams.slice(i * 4, i * 4 + 4), matchType)
    );
  }

  let emptyTeamsId = new Array(shuffledTeams.length / 2).fill("", 0, shuffledTeams.length / 2);
  matches.push(...objectGenerators.createSingleEliminationMatches(emptyTeamsId, matchType));
  return matches;
}

/**
 * @param {Object} team Team object containing fields id and name
 * @returns {Object}    Object containing empty scores for given team
 */
objectGenerators.createTeamScore = function (team) {
  return {
    id: team.id,
    name: team.name,
    matchesWon: 0,
    matchesLost: 0,
    roundsWon: 0,
    roundsLost: 0,
  };
}

/**
 * @param {Proxy} teamsProxy   Proxy with an array of teams
 * @param {Proxy} matchesProxy Proxy with an array of matches
 * @returns {Array}            Array of scores of every team scored in a tournament
 *                             played in League or Combined system
 */
objectGenerators.createScoreTableForRoundRobin = function (teamsProxy, matchesProxy) {
  const teams = utils.getObjectFromProxy(teamsProxy);
  const matches = utils.getObjectFromProxy(matchesProxy);

  let scoreTable = [];
  for (const team of teams)
    scoreTable.push(objectGenerators.createTeamScore(team));

  for (const match of matches) {
    const firstTeamIdx = scoreTable.findIndex((team) => team.id == match.firstTeam);
    const secondTeamIdx = scoreTable.findIndex((team) => team.id == match.secondTeam);

    for (const score of match.scores) {
      scoreTable[firstTeamIdx].roundsWon += Number(score.first_team_score);
      scoreTable[firstTeamIdx].roundsLost += Number(score.second_team_score);
      scoreTable[secondTeamIdx].roundsWon += Number(score.second_team_score);
      scoreTable[secondTeamIdx].roundsLost += Number(score.first_team_score);
    }

    if (match.winner != "" && match.winner == teams[firstTeamIdx].name) {
      scoreTable[firstTeamIdx].matchesWon += 1;
      scoreTable[secondTeamIdx].matchesLost += 1;
    }

    if (match.winner != "" && match.winner == teams[secondTeamIdx].name) {
      scoreTable[secondTeamIdx].matchesWon += 1;
      scoreTable[firstTeamIdx].matchesLost += 1;
    }
  }

  scoreTable.sort(utils.scoreTableComparator);
  return scoreTable;
}

/**
 * @param {string} name                         Name of the tournament
 * @param {string} creatorId                    UID of the tournament's creator
 * @param {Array} teams                         Array of teams attending the tournament
 * @param {types.TournamentType} tournamentType Type of the tournament
 * @param {types.MatchType} matchType           Type of the matches
 * @param {boolean} isPrivate                   Visibility of the tournament
 * @returns {Object}                            Tournament object without matches
 */
objectGenerators.createTournamentObjectWithoutMatches = function (
  name,
  creatorId,
  teams,
  tournamentType,
  matchType,
  isPrivate
) {
  return {
    name: name,
    creator: creatorId,
    teams: teams,
    status: types.TournamentStatus.SCHEDULED,
    type: tournamentType,
    match_type: matchType,
    is_private: isPrivate,
    matches: [],
    winner: "",
  };
};

/**
 * @param {string} name                         Name of the tournament
 * @param {string} creatorId                    UID of the tournament's creator
 * @param {Array} teams                         Array of teams attending the tournament
 * @param {Array} matches                       Array of teams matches to be played
 * @param {types.TournamentType} tournamentType Type of the tournament
 * @param {types.MatchType} matchType           Type of the matches
 * @param {boolean} isPrivate                   Visibility of the tournament
 * @returns {Object}                            Tournament object with matches
 */
objectGenerators.createTournamentObjectWithMatches = function (
  name,
  creatorId,
  teams,
  matches,
  tournamentType,
  matchType,
  isPrivate
) {
  return {
    name: name,
    creator: creatorId,
    teams: teams,
    matches: matches,
    status: types.TournamentStatus.ONGOING,
    type: tournamentType,
    match_type: matchType,
    is_private: isPrivate,
    winner: "",
    created_at: Date.now(),
  };
};

/**
 * @param {Object} tournamentObject Tournament object
 * @param {Array} teams             Array of matches IDs from matches collection
 * @returns {Object}                Tournament object with matches IDs
 */
objectGenerators.setMatchesIdsToTournamentObject = function (tournamentObject, matchesIds) {
  tournamentObject.matches = matchesIds;
};

export default objectGenerators;
