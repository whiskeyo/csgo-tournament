import matchApi from "../api/matchApi";

describe("matchApi utils tests", () => {
  test("Enumerator matchType holds correct values", () => {
    expect(matchApi.MatchType.BO1).toBe(1);
    expect(matchApi.MatchType.BO3).toBe(3);
    expect(matchApi.MatchType.BO5).toBe(5);
  });

  test("Creating match object should work properly and set all given fields", () => {
    const firstTeam = "Team A";
    const secondTeam = "Team B";
    const matchType = matchApi.MatchType.BO3;
    const maps = ["Map 1", "Map 2", "Map 3"];

    expect(matchApi.createMatchObject(firstTeam, secondTeam, matchType, maps)).toEqual({
      first_team: firstTeam,
      second_team: secondTeam,
      match_type: matchType,
      maps: maps,
      scores: [],
      winner: "",
    });
  });
});
