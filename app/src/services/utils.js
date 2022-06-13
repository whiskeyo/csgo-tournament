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
      if (matchDetails.actionsTakenOnMaps < 6) {
        matchDetails.phaseInfo = "Banning maps";
        utils.removeItemFromArray(map, matchDetails.allMaps);
        matchDetails.mapsBanned.push(map.name);
      } else if (matchDetails.actionsTakenOnMaps == 6) {
        matchDetails.phaseInfo = "Picking maps";
        utils.removeItemFromArray(map, matchDetails.allMaps);
        matchDetails.maps.push(map.name);
      } else {
        matchDetails.phaseInfo = "";
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
          break;
        default:
          matchDetails.phaseInfo = "";
          break;
      }
      break;
    }
  }
};

export default utils;
