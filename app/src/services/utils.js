const utils = {};

utils.compare = function(firstElem, secondElem, field) {
    if (firstElem[field] > secondElem[field])
        return -1;

    if (firstElem[field] < secondElem[field])
        return 1;

    return 0;
}

utils.test = function(first, second) {
    const result = utils.compare(first, second, 'nickname');
    console.log("utils.test: " + first['nickname'] + " > " + second['nickname'] + " ===> " + result);
}

utils.nicknameCompare = function(firstElem, secondElem) {
    const first = firstElem.nickname;
    const second = secondElem.nickname;
    const result = firstElem.nickname > secondElem.nickname;
    console.log("utils.nicknameCompare: " + first + " > " + second + " ===> " + result);
    return result;
}

export default utils;