import matchApi from "../api/matchApi";

const matchData = {
  firstTeam: "Team A",
  secondTeam: "Team B",
  matchType: matchApi.MatchType.BO3,
  maps: ["Map 1", "Map 2", "Map 3"],
};

describe("matchApi utils tests", () => {
  test("Enumerator matchType holds correct values", () => {
    expect(matchApi.MatchType.BO1).toBe(1);
    expect(matchApi.MatchType.BO3).toBe(3);
    expect(matchApi.MatchType.BO5).toBe(5);
  });

  test("Creating match object should work properly and set all given fields", () => {
    expect(
      matchApi.createMatchObject(matchData.firstTeam, matchData.secondTeam, matchData.matchType, matchData.maps)
    ).toEqual({
      first_team: matchData.firstTeam,
      second_team: matchData.secondTeam,
      match_type: matchData.matchType,
      maps: matchData.maps,
      scores: [],
      winner: "",
    });
  });
});
