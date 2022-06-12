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
  for (const value of array)
    if (value == item)
      return true;

  return false;
};

export default utils;
