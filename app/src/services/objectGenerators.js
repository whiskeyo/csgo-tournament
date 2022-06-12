/** @namespace objectGenerators */

import types from "./types";

const objectGenerators = {};

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
    // maps: [].fill("", 0, matchType),
    maps: [],
    maps_banned: [],
    scores: [],
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
  for (let idx = 0; idx < teams.length / 2; ++idx) {
    matches.push(this.createMatchObject(teams[idx], teams[teams.length - 1 - idx], matchType));
  }
  matches.length = teams.length - 1;
  matches.fill(this.createMatchObject("", "", matchType), teams.length / 2, teams.length - 1);

  return matches;
};

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
    status: types.TournamentStatus.SCHEDULED,
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
