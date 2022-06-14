import objectGenerators from "./objectGenerators";
import types from "./types";

const utils = {};

utils.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

utils.getObjectFromProxy = function (proxy) {
  return JSON.parse(JSON.stringify(proxy));
};

utils.getTeamNameById = function (teamId, teams) {
  if (teamId === "") return "TBD";

  const team = teams.find((team) => team.id === teamId);
  return utils.getObjectFromProxy(team).name;
};

utils.removeItemFromArray = function (item, array) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
};

utils.getUniqueItemsArrayFromProxyArray = function (proxyArray) {
  return [...new Set(proxyArray)]
    .map((x) => utils.getObjectFromProxy(x))
    .filter((value, index, array) => array.findIndex((value_2) => value === value_2) === index);
};

utils.getUniqueItemsByFieldArrayFromProxyArray = function (proxyArray, field) {
  return [...new Set(proxyArray)]
    .map((x) => utils.getObjectFromProxy(x))
    .filter((value, index, array) => array.findIndex((value_2) => value[field] === value_2[field]) === index);
};

utils.isItemInArray = function (item, array) {
  for (const value of array) if (value == item) return true;

  return false;
};

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
          matchDetails.phaseInfo = "Banning maps";
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.mapsBanned.push(map.name);
          break;
        case 6:
          matchDetails.phaseInfo = "Picking maps";
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.maps.push(map.name);
          matchDetails.scores.push(objectGenerators.createScoreObject());
          break;
        default:
          matchDetails.phaseInfo = "";
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
          matchDetails.phaseInfo = "Banning maps";
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.mapsBanned.push(map.name);
          break;
        case 2: /* falls through */
        case 3: /* falls through */
        case 6:
          matchDetails.phaseInfo = "Picking maps";
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.maps.push(map.name);
          matchDetails.scores.push(objectGenerators.createScoreObject());
          break;
        default:
          matchDetails.phaseInfo = "";
          break;
      }
      break;
    }
    case types.MatchType.BO5: {
      switch (matchDetails.actionsTakenOnMaps) {
        case 0: /* falls through */
        case 1:
          matchDetails.phaseInfo = "Banning maps";
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.mapsBanned.push(map.name);
          break;
        case 2: /* falls through */
        case 3: /* falls through */
        case 4: /* falls through */
        case 5: /* falls through */
        case 6:
          matchDetails.phaseInfo = "Picking maps";
          utils.removeItemFromArray(map, matchDetails.allMaps);
          matchDetails.maps.push(map.name);
          matchDetails.scores.push(objectGenerators.createScoreObject());
          break;
        default:
          matchDetails.phaseInfo = "";
          break;
      }
      break;
    }
  }
};

utils.canFirstCaptainTakeActionOnMap = function (matchDetails, store) {
  return matchDetails.actionsTakenOnMaps % 2 == 0 && store.state.$user.uid != matchDetails.firstTeam.captainId;
};

utils.canSecondCaptainTakeActionOnMap = function (matchDetails, store) {
  return matchDetails.actionsTakenOnMaps % 2 == 1 && store.state.$user.uid != matchDetails.secondTeam.captainId;
};

utils.calculateNextMatchIndex = function (index, numberOfTeams) {
  if (index < numberOfTeams - 1 - 1)
    /* number of matches = number of teams - 1 (and -1 for starting indexing from 0) */
    return Math.floor(index / 2) + numberOfTeams / 2;

  return -1;
};

utils.getNumberOfMapsWonByFirstTeam = function (matchDetails) {
  let mapsWon = 0;
  for (const score of matchDetails.scores) {
    if (Number(score.first_team_score) > 0 && Number(score.first_team_score) > Number(score.second_team_score))
      mapsWon++;
  }

  return mapsWon;
};

utils.getNumberOfMapsWonBySecondTeam = function (matchDetails) {
  let mapsWon = 0;
  for (const score of matchDetails.scores)
    if (Number(score.second_team_score) > 0 && Number(score.second_team_score) > Number(score.first_team_score))
      mapsWon++;

  return mapsWon;
};

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

export default utils;
