import objectGenerators from "../services/objectGenerators";
import types from "../services/types";
import {describe, expect, test} from '@jest/globals';

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

const singleEliminationMatchesIds = ["id1", "id2", "id3", "id4"];

describe("objectGenerators tests", () => {
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
});
