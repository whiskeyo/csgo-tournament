import objectGenerators from "../services/objectGenerators";
import types from "../services/types";
import { describe, expect, test } from "@jest/globals";

const mapName = "Map name!";
const singleEliminationMatchesIds = ["id1", "id2", "id3", "id4"];
const teams = ["teamA", "teamB", "teamC", "teamD", "teamE", "teamF", "teamG", "teamH"];
const teamData = { name: teams[0], id: "thereissomeidfromdb" };
const matchData = {
  firstTeam: "Team A",
  secondTeam: "Team B",
  matchType: types.MatchType.BO3,
};
const tournamentData = {
  name: "Name of the tournament",
  creator: "uid_of_creator",
  teams: ["TeamA", "TeamB", "TeamC", "TeamD", "TeamE", "TeamF", "TeamG", "TeamH"],
  status: types.TournamentStatus.SCHEDULED,
  type: types.TournamentType.SINGLE_ELIMINATION,
  matchType: types.MatchType.BO3,
  isPrivate: false,
  matches: [],
  winner: "",
};

describe("objectGenerators tests", () => {
  const mapObject = objectGenerators.createMapObject(mapName);
  test("Creating map object should work properly and set all given fields", () => {
    expect(mapObject).toEqual({
      name: mapName,
      rounds_won_by_ct: 0,
      rounds_won_by_t: 0,
      matches_played: 0,
    });
  });

  const scoreObject = objectGenerators.createScoreObject();
  test("Creating score object should work properly and set all fields to null", () => {
    expect(scoreObject).toEqual({
      first_team_score: null,
      second_team_score: null,
      rounds_won_by_ct: null,
      rounds_won_by_t: null,
      winner: "",
    });
  });

  const matchObject = objectGenerators.createMatchObject(
    matchData.firstTeam,
    matchData.secondTeam,
    matchData.matchType
  );
  test("Creating match object should work properly and set all given fields", () => {
    expect(matchObject).toEqual({
      first_team: matchData.firstTeam,
      second_team: matchData.secondTeam,
      match_type: matchData.matchType,
      maps: [],
      maps_banned: [],
      scores: [],
      winner: "",
      first_team_map_wins: 0,
      second_team_map_wins: 0,
    });
  });

  const singleEliminationMatches = objectGenerators.createSingleEliminationMatches(
    tournamentData.teams,
    tournamentData.matchType
  );

  test("Creating single elimination matches should create proper number of matches", () => {
    expect(singleEliminationMatches).not.toBeNull();
    expect(singleEliminationMatches.length).toEqual(7);
  });

  test("Creating single elimination matches should set proper matchType", () => {
    expect(singleEliminationMatches[0].match_type).toBe(tournamentData.matchType);
    expect(singleEliminationMatches[1].match_type).toBe(tournamentData.matchType);
    expect(singleEliminationMatches[2].match_type).toBe(tournamentData.matchType);
    expect(singleEliminationMatches[3].match_type).toBe(tournamentData.matchType);
    expect(singleEliminationMatches[4].match_type).toBe(tournamentData.matchType);
    expect(singleEliminationMatches[5].match_type).toBe(tournamentData.matchType);
    expect(singleEliminationMatches[6].match_type).toBe(tournamentData.matchType);
  });

  test("Creating single elimination matches should match teams properly", () => {
    /* First round */
    expect(singleEliminationMatches[0].first_team).toBe(tournamentData.teams[0]);
    expect(singleEliminationMatches[1].first_team).toBe(tournamentData.teams[1]);
    expect(singleEliminationMatches[2].first_team).toBe(tournamentData.teams[2]);
    expect(singleEliminationMatches[3].first_team).toBe(tournamentData.teams[3]);
    expect(singleEliminationMatches[0].second_team).toBe(tournamentData.teams[7]);
    expect(singleEliminationMatches[1].second_team).toBe(tournamentData.teams[6]);
    expect(singleEliminationMatches[2].second_team).toBe(tournamentData.teams[5]);
    expect(singleEliminationMatches[3].second_team).toBe(tournamentData.teams[4]);
    /* Second round (creating empty matches) */
    expect(singleEliminationMatches[4].first_team).toBe("");
    expect(singleEliminationMatches[4].second_team).toBe("");
    expect(singleEliminationMatches[5].first_team).toBe("");
    expect(singleEliminationMatches[5].second_team).toBe("");
    /* Final (creating empty match) */
    expect(singleEliminationMatches[6].first_team).toBe("");
    expect(singleEliminationMatches[6].second_team).toBe("");
  });

  const tournamentObject = objectGenerators.createTournamentObjectWithoutMatches(
    tournamentData.name,
    tournamentData.creator,
    tournamentData.teams,
    tournamentData.type,
    tournamentData.matchType,
    tournamentData.isPrivate,
    tournamentData.name
  );

  test("Creating tournament object should work properly and set all given fields", () => {
    expect(tournamentObject).toEqual({
      name: tournamentData.name,
      creator: tournamentData.creator,
      teams: tournamentData.teams,
      status: tournamentData.status,
      type: tournamentData.type,
      match_type: tournamentData.matchType,
      is_private: tournamentData.isPrivate,
      matches: tournamentData.matches,
      winner: tournamentData.winner,
    });
  });

  test("Setting matches IDs in tournament object should not change any field but matches", () => {
    objectGenerators.setMatchesIdsToTournamentObject(tournamentObject, singleEliminationMatchesIds);

    expect(tournamentObject).toEqual({
      name: tournamentData.name,
      creator: tournamentData.creator,
      teams: tournamentData.teams,
      status: tournamentData.status,
      type: tournamentData.type,
      match_type: tournamentData.matchType,
      is_private: tournamentData.isPrivate,
      matches: singleEliminationMatchesIds,
      winner: tournamentData.winner,
    });
  });

  const roundRobinMatches = objectGenerators.createRoundRobinMatches(teams, matchData.matchType);
  test("Creating round robin matches should return array with proper number of matches", () => {
    expect(roundRobinMatches.length).toEqual(28); /* number of handshakes is n*(n-1)/2 */
  });

  test("Creating round robin matches should properly set match type of all matches", () => {
    for (const match of roundRobinMatches) expect(match.match_type).toEqual(matchData.matchType);
  });

  const combinedMatches = objectGenerators.createCombinedMatches(teams, matchData.matchType);
  test("Creating combined matches should return array with proper number of matches", () => {
    /* 2 groups of 4 teams (each group 6 matches) + number of single elim matches for n/2 teams */
    expect(combinedMatches.length).toEqual(6 + 6 + 3);
  });

  test("Creating combined matches should shuffle team array and generate different matches", () => {
    const combinedMatches1 = objectGenerators.createCombinedMatches(teams, matchData.matchType);
    const combinedMatches2 = objectGenerators.createCombinedMatches(teams, matchData.matchType);

    expect(combinedMatches1).not.toBe(combinedMatches2);
  });

  const teamScore = objectGenerators.createTeamScore(teamData);
  test("Creating team scores should set all given fields properly and other fields to 0", () => {
    expect(teamScore.id).toBe(teamData.id);
    expect(teamScore.name).toBe(teamData.name);
    expect(teamScore.matchesWon).toBe(0);
    expect(teamScore.matchesLost).toBe(0);
    expect(teamScore.roundsWon).toBe(0);
    expect(teamScore.roundsLost).toBe(0);
  });

  const tournamentObjectWithMatches = objectGenerators.createTournamentObjectWithMatches(
    tournamentData.name,
    tournamentData.creator,
    tournamentData.teams,
    tournamentData.matches,
    tournamentData.type,
    tournamentData.matchType,
    tournamentData.isPrivate
  );
  test("Creating tournament object with matches should set all fields properly", () => {
    expect(tournamentObjectWithMatches.name).toBe(tournamentData.name);
    expect(tournamentObjectWithMatches.creator).toBe(tournamentData.creator);
    expect(tournamentObjectWithMatches.teams).toBe(tournamentData.teams);
    expect(tournamentObjectWithMatches.matches).toBe(tournamentData.matches);
    expect(tournamentObjectWithMatches.type).toBe(tournamentData.type);
    expect(tournamentObjectWithMatches.match_type).toBe(tournamentData.matchType);
    expect(tournamentObjectWithMatches.is_private).toBe(tournamentData.isPrivate);
    expect(tournamentObjectWithMatches.winner).toBe("");
    expect(tournamentObjectWithMatches.status).toBe(types.TournamentStatus.ONGOING);
    expect(tournamentObjectWithMatches.created_at).toBeLessThanOrEqual(Date.now());
  });

  const teamsArray = [
    { name: teams[0], id: "idOf" + teams[0] },
    { name: teams[1], id: "idOf" + teams[1] },
    { name: teams[2], id: "idOf" + teams[2] },
  ];
  const matchesArray = [
    {
      firstTeam: teamsArray[0].id,
      secondTeam: teamsArray[1].id,
      scores: [{ first_team_score: 16, second_team_score: 11 }],
      winner: teamsArray[0].name,
    },
    {
      firstTeam: teamsArray[0].id,
      secondTeam: teamsArray[2].id,
      scores: [{ first_team_score: 19, second_team_score: 16 }],
      winner: teamsArray[0].name,
    },
    {
      firstTeam: teamsArray[1].id,
      secondTeam: teamsArray[2].id,
      scores: [{ first_team_score: 14, second_team_score: 16 }],
      winner: teamsArray[2].name,
    },
  ];
  const teamsArrayProxy = new Proxy(teamsArray, {});
  const matchesArrayProxy = new Proxy(matchesArray, {});

  const scoreTable = objectGenerators.createScoreTableForRoundRobin(teamsArrayProxy, matchesArrayProxy);
  test("Creating score table for round robin sorts teams by number of maps won", () => {
    expect(scoreTable[0].name).toBe(teamsArray[0].name); /* first place */
    expect(scoreTable[1].name).toBe(teamsArray[2].name); /* second place */
    expect(scoreTable[2].name).toBe(teamsArray[1].name); /* third place */
  });

  test("Creating score table for round robin counts matches won and lost properly", () => {
    expect(scoreTable[0].matchesWon).toBe(2);
    expect(scoreTable[1].matchesWon).toBe(1);
    expect(scoreTable[2].matchesWon).toBe(0);
    expect(scoreTable[0].matchesLost).toBe(0);
    expect(scoreTable[1].matchesLost).toBe(1);
    expect(scoreTable[2].matchesLost).toBe(2);
  });

  test("Creating score table for round robin counts rounds won and lost properly", () => {
    expect(scoreTable[0].roundsWon).toBe(16 + 19);
    expect(scoreTable[1].roundsWon).toBe(16 + 16);
    expect(scoreTable[2].roundsWon).toBe(11 + 14);
    expect(scoreTable[0].roundsLost).toBe(11 + 16);
    expect(scoreTable[1].roundsLost).toBe(19 + 14);
    expect(scoreTable[2].roundsLost).toBe(16 + 16);
  });
});
