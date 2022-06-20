import utils from "../services/utils";
import { describe, expect, test } from "@jest/globals";
import types from "../services/types";

const values = {
  min: 0,
  max: 10,
};

const teams = [
  { id: "id1", name: "team 1" },
  { id: "id2", name: "team 2" },
  { id: "id3", name: "team 3" },
  { id: "id4", name: "team 4" },
];

describe("utils tests", () => {
  test("getRandomInt creates value in range", () => {
    const randomInt = utils.getRandomInt(values.min, values.max);
    expect(randomInt).toBeGreaterThanOrEqual(values.min);
    expect(randomInt).toBeLessThan(values.max);
  });

  test("isPowerOfTwo returns true if value is a power of two", () => {
    expect(utils.isPowerOfTwo(32)).toBe(true);
  });

  test("isPowerOfTwo returns false if value is not a power of two", () => {
    expect(utils.isPowerOfTwo(3511)).toBe(false);
  });

  test("getObjectFromProxy successfully converts to object", () => {
    const proxy = new Proxy(values, {});
    const result = utils.getObjectFromProxy(proxy);

    expect(result.min).toBe(values.min);
    expect(result.max).toBe(values.max);
  });

  test("getTeamNameById returns a name of the team if ID is found in array", () => {
    expect(utils.getTeamNameById(teams[0].id, teams)).toBe(teams[0].name);
    expect(utils.getTeamNameById(teams[1].id, teams)).toBe(teams[1].name);
    expect(utils.getTeamNameById(teams[2].id, teams)).toBe(teams[2].name);
    expect(utils.getTeamNameById(teams[3].id, teams)).toBe(teams[3].name);
  });

  test("getTeamNameById returns a name TBD if ID is empty", () => {
    expect(utils.getTeamNameById("", teams)).toBe("TBD");
  });

  test("removeItemFromArray does not change array if item is not in array", () => {
    let arr = teams;
    utils.removeItemFromArray({ x: "not existing object" }, arr);
    expect(arr.length).toBe(4);
  });

  test("removeItemFromArray removes existing item from array", () => {
    let arr = teams;
    utils.removeItemFromArray(arr[0], arr);
    expect(arr.length).toBe(3);
  });

  test("getUniqueItemsArrayFromProxyArray returns Array with no duplicates", () => {
    const array = ["a", "b", "c", "d", "a", "e", "d", "f", "a"];
    const arrayProxy = new Proxy(array, {});

    const arrayWithNoDuplicates = utils.getUniqueItemsArrayFromProxyArray(arrayProxy);
    expect(arrayWithNoDuplicates.length).toBe(6);
    expect(arrayWithNoDuplicates).toStrictEqual(["a", "b", "c", "d", "e", "f"]);
  });

  test("getUniqueItemsByFieldArrayFromProxyArray returns Array with no duplicates", () => {
    const array = [
      { first: "a", second: 123 },
      { first: "b", second: 124 },
      { first: "c", second: 125 },
      { first: "d", second: 126 },
      { first: "a", second: 127 },
      { first: "e", second: 128 },
      { first: "d", second: 129 },
      { first: "f", second: 130 },
      { first: "a", second: 131 },
    ];
    const arrayProxy = new Proxy(array, {});

    const arrayWithNoDuplicates = utils.getUniqueItemsByFieldArrayFromProxyArray(arrayProxy, "first");
    expect(arrayWithNoDuplicates.length).toBe(6);
    expect(arrayWithNoDuplicates).toStrictEqual([
      { first: "a", second: 123 },
      { first: "b", second: 124 },
      { first: "c", second: 125 },
      { first: "d", second: 126 },
      { first: "e", second: 128 },
      { first: "f", second: 130 },
    ]);
  });

  test("isItemInArray returns true if item is in array", () => {
    const array = ["a", "b", "c", "d", "a", "e", "d", "f", "a"];
    expect(utils.isItemInArray("c", array)).toBe(true);
  });

  test("isItemInArray returns false if item is not in array", () => {
    const array = ["a", "b", "c", "d", "a", "e", "d", "f", "a"];
    expect(utils.isItemInArray("x", array)).toBe(false);
  });

  test("calculateNextMatchIndex successfully counts indexes for 2 teams", () => {
    const numberOfTeams = 2;
    expect(utils.calculateNextMatchIndex(0, numberOfTeams)).toBe(-1);
  });

  test("calculateNextMatchIndex successfully counts indexes for 4 teams", () => {
    const numberOfTeams = 4;
    expect(utils.calculateNextMatchIndex(0, numberOfTeams)).toBe(2);
    expect(utils.calculateNextMatchIndex(1, numberOfTeams)).toBe(2);
    expect(utils.calculateNextMatchIndex(2, numberOfTeams)).toBe(-1);
  });

  test("calculateNextMatchIndex successfully counts indexes for 8 teams", () => {
    const numberOfTeams = 8;
    expect(utils.calculateNextMatchIndex(0, numberOfTeams)).toBe(4);
    expect(utils.calculateNextMatchIndex(1, numberOfTeams)).toBe(4);
    expect(utils.calculateNextMatchIndex(2, numberOfTeams)).toBe(5);
    expect(utils.calculateNextMatchIndex(3, numberOfTeams)).toBe(5);
    expect(utils.calculateNextMatchIndex(4, numberOfTeams)).toBe(6);
    expect(utils.calculateNextMatchIndex(5, numberOfTeams)).toBe(6);
    expect(utils.calculateNextMatchIndex(6, numberOfTeams)).toBe(-1);
  });

  test("calculateNextMatchIndex successfully counts indexes for 16 teams", () => {
    const numberOfTeams = 16;
    expect(utils.calculateNextMatchIndex(0, numberOfTeams)).toBe(8);
    expect(utils.calculateNextMatchIndex(1, numberOfTeams)).toBe(8);
    expect(utils.calculateNextMatchIndex(2, numberOfTeams)).toBe(9);
    expect(utils.calculateNextMatchIndex(3, numberOfTeams)).toBe(9);
    expect(utils.calculateNextMatchIndex(4, numberOfTeams)).toBe(10);
    expect(utils.calculateNextMatchIndex(5, numberOfTeams)).toBe(10);
    expect(utils.calculateNextMatchIndex(6, numberOfTeams)).toBe(11);
    expect(utils.calculateNextMatchIndex(7, numberOfTeams)).toBe(11);
    expect(utils.calculateNextMatchIndex(8, numberOfTeams)).toBe(12);
    expect(utils.calculateNextMatchIndex(9, numberOfTeams)).toBe(12);
    expect(utils.calculateNextMatchIndex(10, numberOfTeams)).toBe(13);
    expect(utils.calculateNextMatchIndex(11, numberOfTeams)).toBe(13);
    expect(utils.calculateNextMatchIndex(12, numberOfTeams)).toBe(14);
    expect(utils.calculateNextMatchIndex(13, numberOfTeams)).toBe(14);
    expect(utils.calculateNextMatchIndex(14, numberOfTeams)).toBe(-1);
  });

  const maps = [
    { name: "Map 0" },
    { name: "Map 1" },
    { name: "Map 2" },
    { name: "Map 3" },
    { name: "Map 4" },
    { name: "Map 5" },
    { name: "Map 6" },
  ];

  const mapsBO1 = Object.create(maps);
  const matchDetailsBO1 = {
    matchType: types.MatchType.BO1,
    actionsTakenOnMaps: 0,
    allMaps: mapsBO1,
    mapsBanned: [],
    maps: [],
    scores: [],
  };

  test("setMapState moves maps to picked and banned correctly and creates score objects for BO1 matches", () => {
    utils.setMapState(maps[3], matchDetailsBO1);
    expect(matchDetailsBO1.maps).toStrictEqual([]);
    expect(matchDetailsBO1.mapsBanned).toStrictEqual([maps[3].name]);

    matchDetailsBO1.actionsTakenOnMaps = 1;
    utils.setMapState(maps[2], matchDetailsBO1);
    expect(matchDetailsBO1.maps).toStrictEqual([]);
    expect(matchDetailsBO1.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO1.actionsTakenOnMaps = 2;
    utils.setMapState(maps[6], matchDetailsBO1);
    expect(matchDetailsBO1.maps).toStrictEqual([]);
    expect(matchDetailsBO1.mapsBanned).toStrictEqual([maps[3].name, maps[2].name, maps[6].name]);

    matchDetailsBO1.actionsTakenOnMaps = 3;
    utils.setMapState(maps[5], matchDetailsBO1);
    expect(matchDetailsBO1.maps).toStrictEqual([]);
    expect(matchDetailsBO1.mapsBanned).toStrictEqual([maps[3].name, maps[2].name, maps[6].name, maps[5].name]);

    matchDetailsBO1.actionsTakenOnMaps = 4;
    utils.setMapState(maps[4], matchDetailsBO1);
    expect(matchDetailsBO1.maps).toStrictEqual([]);
    expect(matchDetailsBO1.mapsBanned).toStrictEqual([
      maps[3].name,
      maps[2].name,
      maps[6].name,
      maps[5].name,
      maps[4].name,
    ]);

    matchDetailsBO1.actionsTakenOnMaps = 5;
    utils.setMapState(maps[0], matchDetailsBO1);
    expect(matchDetailsBO1.maps).toStrictEqual([]);
    expect(matchDetailsBO1.mapsBanned).toStrictEqual([
      maps[3].name,
      maps[2].name,
      maps[6].name,
      maps[5].name,
      maps[4].name,
      maps[0].name,
    ]);

    matchDetailsBO1.actionsTakenOnMaps = 6;
    utils.setMapState(maps[1], matchDetailsBO1);
    expect(matchDetailsBO1.maps).toStrictEqual([maps[1].name]);
    expect(matchDetailsBO1.mapsBanned).toStrictEqual([
      maps[3].name,
      maps[2].name,
      maps[6].name,
      maps[5].name,
      maps[4].name,
      maps[0].name,
    ]);

    matchDetailsBO1.actionsTakenOnMaps = 100; /* example out of scope going to default */
    utils.setMapState(maps[1], matchDetailsBO1);
    expect(matchDetailsBO1.maps).toStrictEqual([maps[1].name]);
    expect(matchDetailsBO1.mapsBanned).toStrictEqual([
      maps[3].name,
      maps[2].name,
      maps[6].name,
      maps[5].name,
      maps[4].name,
      maps[0].name,
    ]);
  });

  const mapsBO3 = Object.create(maps);
  const matchDetailsBO3 = {
    matchType: types.MatchType.BO3,
    actionsTakenOnMaps: 0,
    allMaps: mapsBO3,
    mapsBanned: [],
    maps: [],
    scores: [],
  };

  test("setMapState moves maps to picked and banned correctly and creates score objects for BO3 matches", () => {
    utils.setMapState(maps[3], matchDetailsBO3);
    expect(matchDetailsBO3.maps).toStrictEqual([]);
    expect(matchDetailsBO3.mapsBanned).toStrictEqual([maps[3].name]);

    matchDetailsBO3.actionsTakenOnMaps = 1;
    utils.setMapState(maps[2], matchDetailsBO3);
    expect(matchDetailsBO3.maps).toStrictEqual([]);
    expect(matchDetailsBO3.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO3.actionsTakenOnMaps = 2;
    utils.setMapState(maps[6], matchDetailsBO3);
    expect(matchDetailsBO3.maps).toStrictEqual([maps[6].name]);
    expect(matchDetailsBO3.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO3.actionsTakenOnMaps = 3;
    utils.setMapState(maps[5], matchDetailsBO3);
    expect(matchDetailsBO3.maps).toStrictEqual([maps[6].name, maps[5].name]);
    expect(matchDetailsBO3.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO3.actionsTakenOnMaps = 4;
    utils.setMapState(maps[4], matchDetailsBO3);
    expect(matchDetailsBO3.maps).toStrictEqual([maps[6].name, maps[5].name]);
    expect(matchDetailsBO3.mapsBanned).toStrictEqual([maps[3].name, maps[2].name, maps[4].name]);

    matchDetailsBO3.actionsTakenOnMaps = 5;
    utils.setMapState(maps[0], matchDetailsBO3);
    expect(matchDetailsBO3.maps).toStrictEqual([maps[6].name, maps[5].name]);
    expect(matchDetailsBO3.mapsBanned).toStrictEqual([maps[3].name, maps[2].name, maps[4].name, maps[0].name]);

    matchDetailsBO3.actionsTakenOnMaps = 6;
    utils.setMapState(maps[1], matchDetailsBO3);
    expect(matchDetailsBO3.maps).toStrictEqual([maps[6].name, maps[5].name, maps[1].name]);
    expect(matchDetailsBO3.mapsBanned).toStrictEqual([maps[3].name, maps[2].name, maps[4].name, maps[0].name]);

    matchDetailsBO3.actionsTakenOnMaps = 100; /* example out of scope going to default */
    utils.setMapState(maps[1], matchDetailsBO3);
    expect(matchDetailsBO3.maps).toStrictEqual([maps[6].name, maps[5].name, maps[1].name]);
    expect(matchDetailsBO3.mapsBanned).toStrictEqual([maps[3].name, maps[2].name, maps[4].name, maps[0].name]);
  });

  const mapsBO5 = Object.create(maps);
  const matchDetailsBO5 = {
    matchType: types.MatchType.BO5,
    actionsTakenOnMaps: 0,
    allMaps: mapsBO5,
    mapsBanned: [],
    maps: [],
    scores: [],
  };

  test("setMapState moves maps to picked and banned correctly and creates score objects for BO5 matches", () => {
    utils.setMapState(maps[3], matchDetailsBO5);
    expect(matchDetailsBO5.maps).toStrictEqual([]);
    expect(matchDetailsBO5.mapsBanned).toStrictEqual([maps[3].name]);

    matchDetailsBO5.actionsTakenOnMaps = 1;
    utils.setMapState(maps[2], matchDetailsBO5);
    expect(matchDetailsBO5.maps).toStrictEqual([]);
    expect(matchDetailsBO5.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO5.actionsTakenOnMaps = 2;
    utils.setMapState(maps[6], matchDetailsBO5);
    expect(matchDetailsBO5.maps).toStrictEqual([maps[6].name]);
    expect(matchDetailsBO5.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO5.actionsTakenOnMaps = 3;
    utils.setMapState(maps[5], matchDetailsBO5);
    expect(matchDetailsBO5.maps).toStrictEqual([maps[6].name, maps[5].name]);
    expect(matchDetailsBO5.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO5.actionsTakenOnMaps = 4;
    utils.setMapState(maps[4], matchDetailsBO5);
    expect(matchDetailsBO5.maps).toStrictEqual([maps[6].name, maps[5].name, maps[4].name]);
    expect(matchDetailsBO5.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO5.actionsTakenOnMaps = 5;
    utils.setMapState(maps[0], matchDetailsBO5);
    expect(matchDetailsBO5.maps).toStrictEqual([maps[6].name, maps[5].name, maps[4].name, maps[0].name]);
    expect(matchDetailsBO5.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO5.actionsTakenOnMaps = 6;
    utils.setMapState(maps[1], matchDetailsBO5);
    expect(matchDetailsBO5.maps).toStrictEqual([maps[6].name, maps[5].name, maps[4].name, maps[0].name, maps[1].name]);
    expect(matchDetailsBO5.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);

    matchDetailsBO5.actionsTakenOnMaps = 100; /* example out of scope going to default */
    utils.setMapState(maps[1], matchDetailsBO5);
    expect(matchDetailsBO5.maps).toStrictEqual([maps[6].name, maps[5].name, maps[4].name, maps[0].name, maps[1].name]);
    expect(matchDetailsBO5.mapsBanned).toStrictEqual([maps[3].name, maps[2].name]);
  });

  const banning = "Banning maps";
  const picking = "Picking maps";
  test("setBanningAndPickingPhase works properly for a BO1 match", () => {
    expect(utils.setBanningAndPickingPhase(0, types.MatchType.BO1)).toBe(banning);
    expect(utils.setBanningAndPickingPhase(1, types.MatchType.BO1)).toBe(banning);
    expect(utils.setBanningAndPickingPhase(2, types.MatchType.BO1)).toBe(banning);
    expect(utils.setBanningAndPickingPhase(3, types.MatchType.BO1)).toBe(banning);
    expect(utils.setBanningAndPickingPhase(4, types.MatchType.BO1)).toBe(banning);
    expect(utils.setBanningAndPickingPhase(5, types.MatchType.BO1)).toBe(picking);
    expect(utils.setBanningAndPickingPhase(6, types.MatchType.BO1)).toBe("");
  });

  test("setBanningAndPickingPhase works properly for a BO3 match", () => {
    expect(utils.setBanningAndPickingPhase(0, types.MatchType.BO3)).toBe(banning);
    expect(utils.setBanningAndPickingPhase(1, types.MatchType.BO3)).toBe(picking);
    expect(utils.setBanningAndPickingPhase(2, types.MatchType.BO3)).toBe(picking);
    expect(utils.setBanningAndPickingPhase(3, types.MatchType.BO3)).toBe(banning);
    expect(utils.setBanningAndPickingPhase(4, types.MatchType.BO3)).toBe(banning);
    expect(utils.setBanningAndPickingPhase(5, types.MatchType.BO3)).toBe(picking);
    expect(utils.setBanningAndPickingPhase(6, types.MatchType.BO3)).toBe("");
  });

  test("setBanningAndPickingPhase works properly for a BO5 match", () => {
    expect(utils.setBanningAndPickingPhase(0, types.MatchType.BO5)).toBe(banning);
    expect(utils.setBanningAndPickingPhase(1, types.MatchType.BO5)).toBe(picking);
    expect(utils.setBanningAndPickingPhase(2, types.MatchType.BO5)).toBe(picking);
    expect(utils.setBanningAndPickingPhase(3, types.MatchType.BO5)).toBe(picking);
    expect(utils.setBanningAndPickingPhase(4, types.MatchType.BO5)).toBe(picking);
    expect(utils.setBanningAndPickingPhase(5, types.MatchType.BO5)).toBe(picking);
    expect(utils.setBanningAndPickingPhase(6, types.MatchType.BO5)).toBe("");
  });

  test("canFirstCaptainTakeActionOnMap returns true if it is turn of first captain", () => {
    const matchDetailsSmall = { actionsTakenOnMaps: 4, firstTeam: { captainId: "captainId" } };
    const store = { state: { $user: { uid: "notCaptainId" } } };

    expect(utils.canFirstCaptainTakeActionOnMap(matchDetailsSmall, store)).toBe(true);
  });

  test("canFirstCaptainTakeActionOnMap returns true if it is turn of first captain", () => {
    const matchDetailsSmall = { actionsTakenOnMaps: 4, firstTeam: { captainId: "captainId" } };
    const store = { state: { $user: { uid: "captainId" } } };

    expect(utils.canFirstCaptainTakeActionOnMap(matchDetailsSmall, store)).toBe(false);
  });

  test("canSecondCaptainTakeActionOnMap returns true if it is turn of first captain", () => {
    const matchDetailsSmall = { actionsTakenOnMaps: 5, secondTeam: { captainId: "captainId" } };
    const store = { state: { $user: { uid: "notCaptainId" } } };

    expect(utils.canSecondCaptainTakeActionOnMap(matchDetailsSmall, store)).toBe(true);
  });

  test("canSecondCaptainTakeActionOnMap returns true if it is turn of first captain", () => {
    const matchDetailsSmall = { actionsTakenOnMaps: 5, secondTeam: { captainId: "captainId" } };
    const store = { state: { $user: { uid: "captainId" } } };

    expect(utils.canSecondCaptainTakeActionOnMap(matchDetailsSmall, store)).toBe(false);
  });

  const scores = [
    { first_team_score: "16", second_team_score: "12" },
    { first_team_score: "11", second_team_score: "16" },
    { first_team_score: "19", second_team_score: "15" },
    { first_team_score: "3", second_team_score: "16" },
    { first_team_score: "19", second_team_score: "16" },
  ];
  test("getNumberOfMapsWonByFirstTeam counts number of maps won properly", () => {
    const matchDetails = { scores: scores };
    expect(utils.getNumberOfMapsWonByFirstTeam(matchDetails)).toBe(3);
  });

  test("getNumberOfMapsWonBySecondTeam counts number of maps won properly", () => {
    const matchDetails = { scores: scores };
    expect(utils.getNumberOfMapsWonBySecondTeam(matchDetails)).toBe(2);
  });

  const determineWinnerDetails = {
    firstTeam: { name: "First team" },
    secondTeam: { name: "Second team" },
  };
  test("determineWinner returns string with the name of the first team that won the BO1 match", () => {
    determineWinnerDetails.matchType = types.MatchType.BO1;
    determineWinnerDetails.firstTeamMapWins = 1;
    determineWinnerDetails.secondTeamMapWins = 0;
    expect(utils.determineWinner(determineWinnerDetails)).toBe("First team");
  });

  test("determineWinner returns string with the name of the second team that won the BO1 match", () => {
    determineWinnerDetails.matchType = types.MatchType.BO1;
    determineWinnerDetails.firstTeamMapWins = 0;
    determineWinnerDetails.secondTeamMapWins = 1;
    expect(utils.determineWinner(determineWinnerDetails)).toBe("Second team");
  });

  test("determineWinner returns empty string when none of the teams won the map in the BO1 match", () => {
    determineWinnerDetails.matchType = types.MatchType.BO1;
    determineWinnerDetails.firstTeamMapWins = 0;
    determineWinnerDetails.secondTeamMapWins = 0;
    expect(utils.determineWinner(determineWinnerDetails)).toBe("");
  });

  test("determineWinner returns string with the name of the first team that won the BO3 match", () => {
    determineWinnerDetails.matchType = types.MatchType.BO3;
    determineWinnerDetails.firstTeamMapWins = 2;
    determineWinnerDetails.secondTeamMapWins = 1;
    expect(utils.determineWinner(determineWinnerDetails)).toBe("First team");
  });

  test("determineWinner returns string with the name of the second team that won the BO3 match", () => {
    determineWinnerDetails.matchType = types.MatchType.BO3;
    determineWinnerDetails.firstTeamMapWins = 0;
    determineWinnerDetails.secondTeamMapWins = 2;
    expect(utils.determineWinner(determineWinnerDetails)).toBe("Second team");
  });

  test("determineWinner returns empty string when none of the teams won the map in the BO3 match", () => {
    determineWinnerDetails.matchType = types.MatchType.BO3;
    determineWinnerDetails.firstTeamMapWins = 0;
    determineWinnerDetails.secondTeamMapWins = 0;
    expect(utils.determineWinner(determineWinnerDetails)).toBe("");
  });

  test("determineWinner returns string with the name of the first team that won the BO5 match", () => {
    determineWinnerDetails.matchType = types.MatchType.BO5;
    determineWinnerDetails.firstTeamMapWins = 3;
    determineWinnerDetails.secondTeamMapWins = 2;
    expect(utils.determineWinner(determineWinnerDetails)).toBe("First team");
  });

  test("determineWinner returns string with the name of the second team that won the BO5 match", () => {
    determineWinnerDetails.matchType = types.MatchType.BO5;
    determineWinnerDetails.firstTeamMapWins = 1;
    determineWinnerDetails.secondTeamMapWins = 3;
    expect(utils.determineWinner(determineWinnerDetails)).toBe("Second team");
  });

  test("determineWinner returns empty string when none of the teams won the map in the BO5 match", () => {
    determineWinnerDetails.matchType = types.MatchType.BO5;
    determineWinnerDetails.firstTeamMapWins = 0;
    determineWinnerDetails.secondTeamMapWins = 0;
    expect(utils.determineWinner(determineWinnerDetails)).toBe("");
  });

  const firstTeam = {
    matchesWon: 0,
    roundsWon: 0,
    matchesLost: 0,
    roundsLost: 0,
  };
  const secondTeam = {
    matchesWon: 0,
    roundsWon: 0,
    matchesLost: 0,
    roundsLost: 0,
  };

  test("scoreTableComparator determines which team won more matches", () => {
    const firstTeamWithMoreMatchesWon = Object.create(firstTeam);
    firstTeamWithMoreMatchesWon.matchesWon = 1;
    expect(utils.scoreTableComparator(firstTeamWithMoreMatchesWon, secondTeam)).toBe(-1);

    const secondTeamWithMoreMatchesWon = Object.create(secondTeam);
    secondTeamWithMoreMatchesWon.matchesWon = 1;
    expect(utils.scoreTableComparator(firstTeam, secondTeamWithMoreMatchesWon)).toBe(1);
  });

  test("scoreTableComparator determines which team won more rounds", () => {
    const firstTeamWithMoreRoundsWon = Object.create(firstTeam);
    firstTeamWithMoreRoundsWon.roundsWon = 1;
    expect(utils.scoreTableComparator(firstTeamWithMoreRoundsWon, secondTeam)).toBe(-1);

    const secondTeamWithMoreRoundsWon = Object.create(secondTeam);
    secondTeamWithMoreRoundsWon.roundsWon = 1;
    expect(utils.scoreTableComparator(firstTeam, secondTeamWithMoreRoundsWon)).toBe(1);
  });

  test("scoreTableComparator determines which team lost less matches", () => {
    const firstTeamWithLessMatchesLost = Object.create(firstTeam);
    firstTeamWithLessMatchesLost.matchesLost = 1;
    expect(utils.scoreTableComparator(firstTeamWithLessMatchesLost, secondTeam)).toBe(1);

    const secondTeamWithLessMatchesLost = Object.create(secondTeam);
    secondTeamWithLessMatchesLost.matchesLost = 1;
    expect(utils.scoreTableComparator(firstTeam, secondTeamWithLessMatchesLost)).toBe(-1);
  });

  test("scoreTableComparator determines which team lost less rounds", () => {
    const firstTeamWithLessRoundsLost = Object.create(firstTeam);
    firstTeamWithLessRoundsLost.roundsLost = 1;
    expect(utils.scoreTableComparator(firstTeamWithLessRoundsLost, secondTeam)).toBe(1);

    const secondTeamWithLessRoundsLost = Object.create(secondTeam);
    secondTeamWithLessRoundsLost.roundsLost = 1;
    expect(utils.scoreTableComparator(firstTeam, secondTeamWithLessRoundsLost)).toBe(-1);
  });

  test("scoreTableComparator returns 0 when both team have the same statistics", () => {
    expect(utils.scoreTableComparator(firstTeam, secondTeam)).toBe(0);
  });
});
