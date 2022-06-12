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
  if (index > -1) {
    array.splice(index, 1);
  }
};

utils.getUniqueItemsArrayFromProxyArray = function (proxyArray) {
  return [...new Set(proxyArray)]
    .map((x) => utils.getObjectFromProxy(x))
    .filter((value, index, array) => array.findIndex((value_2) => value.id === value_2.id) === index);
};

export default utils;
