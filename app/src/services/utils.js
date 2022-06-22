/** @namespace utils */


import objectGenerators from "./objectGenerators";
import types from "./types";

const utils = {};

/**
 * Generates random integer from given range
 * @method
 * @param {Number} min Value starting range of random number generator
 * @param {Number} max Value ending range of random number generator
 * @returns {Number}   Random integer from [min, max] range
 */
utils.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Checks if number is a power of two
 * @method
 * @param {Number} value Value to be checked
 * @returns {Boolean}    Boolean saying if given value is a power of two
 */
utils.isPowerOfTwo = function (value) {
  return (Math.log(value) / Math.log(2)) % 1 === 0;
};

/**
 * Parses proxy object and returns an internal object
 * @method
 * @param {Proxy} proxy Proxy to be converted to an Object
 * @returns {Object}    Flattened Proxy to an Object
 */
utils.getObjectFromProxy = function (proxy) {
  return JSON.parse(JSON.stringify(proxy));
};

/**
 * Returns team name if given teamId exists and TBD otherwise
 * @method
 * @param {string} teamId ID of a team stored in Firestore Database
 * @param {Array} teams   Array of all teams from Firestore Database
 * @returns {string}      Name of the team or TBD if there is no team with given ID
 */
utils.getTeamNameById = function (teamId, teams) {
  if (teamId === "") return "TBD";

  const team = teams.find((team) => team.id === teamId);
  return utils.getObjectFromProxy(team).name;
};

/**
 * Removes given object from an array if the object exists
 * @method
 * @param {Object} item Object which needs to be removed (if exists)
 * @param {Array} array Array of objects that is going to have an item removed
 */
utils.removeItemFromArray = function (item, array) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
};

/**
 * Parses an array of proxy objects, removes duplicates and returns filtered array
 * @method
 * @param {Array} proxyArray Array of Proxy objects with possible duplicates
 * @returns {Array}          Array of unique items stored in proxyArray
 */
utils.getUniqueItemsArrayFromProxyArray = function (proxyArray) {
  return [...new Set(proxyArray)]
    .map((x) => utils.getObjectFromProxy(x))
    .filter((value, index, array) => array.findIndex((value_2) => value === value_2) === index);
};

/**
 * Parses an array of proxy objects, removes duplicates by given field and returns filtered array
 * @method
 * @param {Array} proxyArray Array of Proxy objects with possible duplicates
 * @param {string} field     Name of the field to be checked uniqueness of objects
 * @returns {Array}          Array of unique items stored in proxyArray
 */
utils.getUniqueItemsByFieldArrayFromProxyArray = function (proxyArray, field) {
  return [...new Set(proxyArray)]
    .map((x) => utils.getObjectFromProxy(x))
    .filter((value, index, array) => array.findIndex((value_2) => value[field] === value_2[field]) === index);
};

/**
 * Checks if the object exists in an array
 * @method
 * @param {Object} item Object which presence is checked in array
 * @param {Array} array Array of objects
 * @returns {Boolean}   Boolean saying if item is in array
 */
utils.isItemInArray = function (item, array) {
  for (const value of array) {
    if (value == item) {
      return true;
    }
  }

  return false;
};

/**
 * Randomizes order of elements in an array
 * @method
 * @param {Array} array Array of objects to be shuffled
 */
utils.shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

/**
 * Handles moving maps to selected/banned based on number of actions taken during banning phase
 * @method
 * @param {Object} map          Object containing map data
 * @param {Object} matchDetails Object containing details of the match which is being changed
 *                              on different events such as banning and picking a map
 */
utils.setMapState = function (map, matchDetails) {
  switch (matchDetails.matchType) {
    case types.MatchType.BO1: {
      switch (matchDetails.actionsTakenOnMaps) {
        case 0: /* falls through */
        case 1: /* falls through */
        case 2: /* falls through */
        case 3: /* falls through */
        case 4: /* falls through */
        case 5:
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.mapsBanned.push(map.name);
          break;
        case 6:
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.maps.push(map.name);
          matchDetails.scores.push(objectGenerators.createScoreObject());
          break;
        default:
          break;
      }
      break;
    }
    case types.MatchType.BO3: {
      switch (matchDetails.actionsTakenOnMaps) {
        case 0: /* falls through */
        case 1: /* falls through */
        case 4: /* falls through */
        case 5:
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.mapsBanned.push(map.name);
          break;
        case 2: /* falls through */
        case 3: /* falls through */
        case 6:
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.maps.push(map.name);
          matchDetails.scores.push(objectGenerators.createScoreObject());
          break;
        default:
          break;
      }
      break;
    }
    case types.MatchType.BO5: {
      switch (matchDetails.actionsTakenOnMaps) {
        case 0: /* falls through */
        case 1:
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.mapsBanned.push(map.name);
          break;
        case 2: /* falls through */
        case 3: /* falls through */
        case 4: /* falls through */
        case 5: /* falls through */
        case 6:
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.maps.push(map.name);
          matchDetails.scores.push(objectGenerators.createScoreObject());
          break;
        default:
          break;
      }
      break;
    }
  }
};

/**
 * Returns name of the current ban/pick phase based on the matchType
 * @method
 * @param {Number} actionsTakenOnMaps Number of bans/picks made
 * @param {types.MatchType} matchType Type of the match (BO1/BO3/BO5)
 * @returns {string}                  String with a name of current banning/picking phase
 */
utils.setBanningAndPickingPhase = function (actionsTakenOnMaps, matchType) {
  switch (matchType) {
    case types.MatchType.BO1: {
      /* ban - ban - ban - ban - ban - ban - pick */
      switch (actionsTakenOnMaps) {
        case 0: /* falls through */
        case 1: /* falls through */
        case 2: /* falls through */
        case 3: /* falls through */
        case 4:
          return "Banning maps";
        case 5:
          return "Picking maps";
        default:
          return "";
      }
    }
    case types.MatchType.BO3: {
      /* ban - ban - pick - pick - ban - ban - pick */
      switch (actionsTakenOnMaps) {
        case 0: /* falls through */
        case 3: /* falls through */
        case 4:
          return "Banning maps";
        case 1: /* falls through */
        case 2: /* falls through */
        case 5:
          return "Picking maps";
        default:
          return "";
      }
    }
    case types.MatchType.BO5: {
      /* ban - ban - pick - pick - pick - pick - pick */
      switch (actionsTakenOnMaps) {
        case 0:
          return "Banning maps";
        case 1: /* falls through */
        case 2: /* falls through */
        case 3: /* falls through */
        case 4: /* falls through */
        case 5:
          return "Picking maps";
        default:
          return "";
      }
    }
  }
};

/**
 * Checks whether first captain can take an action in ban/pick phase
 * @method
 * @param {Object} matchDetails Object containing match details
 * @param {Object} store        Vuex global store
 * @returns {Boolean}           Boolean saying if it is a turn of the first team and
 *                              if currently logged in user is a captain of the first team
 */
utils.canFirstCaptainTakeActionOnMap = function (matchDetails, store) {
  return matchDetails.actionsTakenOnMaps % 2 == 0 && store.state.$user.uid !== matchDetails.firstTeam.captainId;
};

/**
 * Checks whether second captain can take an action in ban/pick phase
 * @method
 * @param {Object} matchDetails Object containing match details
 * @param {Object} store        Vuex global store
 * @returns {Boolean}           Boolean saying if it is a turn of the second team and
 *                              if currently logged in user is a captain of the second team
 */
utils.canSecondCaptainTakeActionOnMap = function (matchDetails, store) {
  return matchDetails.actionsTakenOnMaps % 2 == 1 && store.state.$user.uid != matchDetails.secondTeam.captainId;
};

/**
 * Calculates the index of the next match in Single Elimination tournament
 * @method
 * @param {Number}   index         Current index of the match
 * @param {Number}   numberOfTeams Number of teams attendind the tournament
 * @returns {Number}               Index of the next match if there is any and -1 if not
 */
utils.calculateNextMatchIndex = function (index, numberOfTeams) {
  if (index < numberOfTeams - 1 - 1)
    /* number of matches = number of teams - 1 (and -1 for starting indexing from 0) */
    return Math.floor(index / 2) + numberOfTeams / 2;

  return -1;
};

/**
 * Counts number of maps won by first team
 * @method
 * @param {Object} matchDetails Object containing match details
 * @returns {Number}            Number of maps won by the first team
 */
utils.getNumberOfMapsWonByFirstTeam = function (matchDetails) {
  let mapsWon = 0;
  for (const score of matchDetails.scores) {
    if (Number(score.first_team_score) > 0 && Number(score.first_team_score) > Number(score.second_team_score))
      mapsWon++;
  }

  return mapsWon;
};

/**
 * Counts number of maps won by second team
 * @method
 * @param {Object} matchDetails Object containing match details
 * @returns {Number}            Number of maps won by the second team
 */
utils.getNumberOfMapsWonBySecondTeam = function (matchDetails) {
  let mapsWon = 0;
  for (const score of matchDetails.scores)
    if (Number(score.second_team_score) > 0 && Number(score.second_team_score) > Number(score.first_team_score))
      mapsWon++;

  return mapsWon;
};

/**
 * Returns the name of the team who won the match.
 * @method
 * @param {Object} matchDetails Object containing match details
 * @returns {string}            Name of the team which won the match
 */
utils.determineWinner = function (matchDetails) {
  switch (matchDetails.matchType) {
    case types.MatchType.BO1: {
      if (matchDetails.firstTeamMapWins == 1) return matchDetails.firstTeam.name;
      else if (matchDetails.secondTeamMapWins == 1) return matchDetails.secondTeam.name;
      else return "";
    }
    case types.MatchType.BO3: {
      if (matchDetails.firstTeamMapWins == 2) return matchDetails.firstTeam.name;
      else if (matchDetails.secondTeamMapWins == 2) return matchDetails.secondTeam.name;
      else return "";
    }
    case types.MatchType.BO5: {
      if (matchDetails.firstTeamMapWins == 3) return matchDetails.firstTeam.name;
      else if (matchDetails.secondTeamMapWins == 3) return matchDetails.secondTeam.name;
      else return "";
    }
  }
};

/**
 * Comparator used in sorting function to set the correct order of teams in table
 * @method
 * @param {Object} firstTeam  Object containing scores of the first team
 * @param {Object} secondTeam Object containing scores of the second team
 * @returns {Number}          Value used in Array.sort() as a comparator
 */
utils.scoreTableComparator = function (firstTeam, secondTeam) {
  if (firstTeam.matchesWon > secondTeam.matchesWon) return -1;
  if (firstTeam.matchesWon < secondTeam.matchesWon) return 1;

  if (firstTeam.roundsWon > secondTeam.roundsWon) return -1;
  if (firstTeam.roundsWon < secondTeam.roundsWon) return 1;

  if (firstTeam.matchesLost < secondTeam.matchesLost) return -1;
  if (firstTeam.matchesLost > secondTeam.matchesLost) return 1;

  if (firstTeam.roundsLost < secondTeam.roundsLost) return -1;
  if (firstTeam.roundsLost > secondTeam.roundsLost) return 1;

  return 0;
};

export default utils;
