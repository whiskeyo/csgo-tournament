/** @namespace types */
const types = {};

/**
 * Enum specyfing the type of the match
 * @readonly
 * @enum {string}
 */
types.MatchType = {
  /** Best Of One */
  BO1: 1,
  /** Best Of Three */
  BO3: 3,
  /** Best Of Five */
  BO5: 5,
};

/**
 * Enum for tracking status of the tournament.
 * @readonly
 * @enum {string}
 */
types.TournamentStatus = {
  /** Tournament scheduled, has not started yet */
  SCHEDULED: "Scheduled",
  /** Tournament started */
  ONGOING: "Ongoing",
  /** Tournament finished, winner already selected */
  FINISHED: "Finished",
};

/**
 * Enum for specifying the type of the tournament.
 * @readonly
 * @enum {string}
 */
types.TournamentType = {
  /** Single Elimination, matches are distributed out of n teams by choosing
   * teams 0-n, 1-(n-1), ..., (n/2-1)-(n/2) */
  SINGLE_ELIMINATION: "Single Elimination",
  /** League, every team has to play with every other */
  ALL_VS_ALL: "League (All versus All)",
  /** League + Single Elimination, at first teams play all vs all in groups,
   * then the best teams from gropus advance and play in single elimination format */
  COMBINED: "Combined",
};

export default types;
