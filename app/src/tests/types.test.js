import types from "../services/types";
import {describe, expect, test} from '@jest/globals';

describe("types tests", () => {
  test("Enumerator types.MatchType holds correct values", () => {
    expect(types.MatchType.BO1).toBe(1);
    expect(types.MatchType.BO3).toBe(3);
    expect(types.MatchType.BO5).toBe(5);
  });

  test("Enumerator types.TournamentStatus holds correct values", () => {
    expect(types.TournamentStatus.SCHEDULED).toBe("Scheduled");
    expect(types.TournamentStatus.ONGOING).toBe("Ongoing");
    expect(types.TournamentStatus.FINISHED).toBe("Finished");
  });

  test("Enumerator types.TournamentType holds correct values", () => {
    expect(types.TournamentType.SINGLE_ELIMINATION).toBe("Single Elimination");
    expect(types.TournamentType.ALL_VS_ALL).toBe("League (All versus All)");
    expect(types.TournamentType.COMBINED).toBe("Combined");
  });
});
