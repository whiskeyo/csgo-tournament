const utils = {};

utils.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default utils;
