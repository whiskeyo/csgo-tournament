<template>
  <div>
    <h1>Tournament Details</h1>
    <div class="row">
      <div class="col-6">
        <h2>{{ this.tournamentDetails.name }}</h2>
        <div>
          <h3>Organiser</h3>
          {{ this.tournamentDetails.creator.nickname }} ({{ this.tournamentDetails.creator.fullname }})<br />
          Contact email: {{ this.tournamentDetails.creator.email }}
        </div>
        <h2>Type of the tournament</h2>
        {{ this.tournamentDetails.type }}, matches played in Best Of {{ this.tournamentDetails.matchType }} system
        <div v-if="isSingleEliminationTournament">
          <h2>Teams attending</h2>
          <ul>
            <li v-for="(team, i) in this.tournamentDetails.teams" :key="i">
              {{ team.name }}
            </li>
          </ul>
        </div>
        <div v-else>
          <div v-if="isAllVsAllTournament">
            <h2>Score Table</h2>
            <table class="table table-dark table-striped text-center align-middle">
              <thead>
                <tr>
                  <th style="width: 10%">#</th>
                  <th style="width: 50%" class="text-start">Team</th>
                  <th style="width: 10%">W</th>
                  <th style="width: 10%">L</th>
                  <th style="width: 10%">RW</th>
                  <th style="width: 10%">RL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(score, idx) in this.tournamentDetails?.scoreTable" :key="idx">
                  <td class="text-center">{{ idx + 1 }}</td>
                  <td class="text-start">{{ score.name }}</td>
                  <td class="text-center">{{ score.matchesWon }}</td>
                  <td class="text-center">{{ score.matchesLost }}</td>
                  <td class="text-center">{{ score.roundsWon }}</td>
                  <td class="text-center">{{ score.roundsLost }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="isCombinedTournament">
            <h2>Score Tables</h2>
            <table class="table table-dark table-striped text-center align-middle">
              <thead>
                <tr>
                  <th style="width: 10%">#</th>
                  <th style="width: 50%" class="text-start">Team</th>
                  <th style="width: 10%">W</th>
                  <th style="width: 10%">L</th>
                  <th style="width: 10%">RW</th>
                  <th style="width: 10%">RL</th>
                </tr>
              </thead>
              <tbody v-for="(groupScores, idx) in this.tournamentDetails?.scoreTable" :key="idx">
                <tr v-for="(score, idx2) in groupScores" :key="idx2">
                  <td class="text-center">{{ idx2 + 1 }}</td>
                  <td class="text-start">{{ score.name }}</td>
                  <td class="text-center">{{ score.matchesWon }}</td>
                  <td class="text-center">{{ score.matchesLost }}</td>
                  <td class="text-center">{{ score.roundsWon }}</td>
                  <td class="text-center">{{ score.roundsLost }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- <div class="col-2"></div> -->
      <div class="col-6">
        <h2>Matches</h2>
        <ul>
          <template v-for="(match, i) in this.tournamentDetails?.matches" :key="i">
            <li>
              <template v-if="isSingleEliminationTournament">
                {{ this.getRoundStringFromMatchIdx(i) }}
              </template>
              <template v-else-if="isCombinedTournament">
                {{ this.getGroupOrRoundStringFromMatchIdx(i) }}
              </template>
              <router-link
                :to="'/tournament/matches/' + tournamentDetails.matchesId[i]"
                v-if="getTeamName(match.firstTeam) != 'TBD' && getTeamName(match.secondTeam) != 'TBD'"
                class="link-light"
              >
                {{
                  this.getTeamName(match.firstTeam) +
                  " vs. " +
                  this.getTeamName(match.secondTeam) +
                  " (" +
                  match.firstTeamMapWins +
                  ":" +
                  match.secondTeamMapWins +
                  ")"
                }}
              </router-link>
              <template v-else-if="getTeamName(match.firstTeam) != 'TBD' && getTeamName(match.secondTeam) == 'TBD'">
                {{ getTeamName(match.firstTeam) }} vs. TBD
              </template>
              <template v-else-if="getTeamName(match.firstTeam) == 'TBD' && getTeamName(match.secondTeam) != 'TBD'">
                TBD vs. {{ getTeamName(match.secondTeam) }}
              </template>
              <template v-else>TBD vs. TBD</template>
            </li>
          </template>
        </ul>
        <div v-if="tournamentDetails.matches[tournamentDetails.matches.length - 1]?.winner != ''">
          <h2>Winner of the tournament</h2>
          <h3>{{ this.tournamentDetails?.matches[tournamentDetails.matches.length - 1]?.winner }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tournamentApi from "../api/tournamentApi";
import teamApi from "../api/teamApi";
import matchApi from "../api/matchApi";
import objectGenerators from "../services/objectGenerators";
import utils from "../services/utils";
import types from "../services/types";

/**
 * @vue-data {Object} tournamentDetails - Details about single tournament fetched
 * @vue-event {string} getTeamName - Wrapper for utils.getTeamNameById
 * @vue-event {string} getRoundStringFromMatchIdx - Calculates round number based on the index
 *                                                  of the match and returns a string with its name
 * @vue-event {string} getGroupOrRoundStringFromMatchIdx - Calculates the group name or round number
 *                                                         by the index of the match
 * @vue-event {Boolean} areAllGroupMatchesFinished - Checks if all matches in given group have finished
 * @vue-event {Boolean} created - Fetches all tournament details required to display them in a view
 * @vue-computed {Boolean} isSingleEliminationTournament - Checks if selected type is SINGLE_ELIMINATION
 * @vue-computed {Boolean} isAllVsAllTournament - Checks if selected type is ALL_VS_ALL
 * @vue-computed {Boolean} isCombinedTournament - Checks if selected type is COMBINED
 */
export default {
  name: "Tournament Details",

  data: function () {
    return {
      tournamentDetails: {
        id: "",
        name: "",
        creatorId: "",
        creator: {
          nickname: "abc",
          fullname: "def",
          email: "ghi",
          uid: "",
        },
        matchesId: [],
        matches: [],
        teamsId: [],
        teams: [],
        matchType: null,
        type: "",
        status: "",
        winner: "",
        scoreTable: [],
        numberOfRounds: 0,
      },
    };
  },

  watch: {
    tournamentDetails: {
      depp: true,
      handler: function () {
        this.tournamentDetails.winner =
          this.tournamentDetails.matches[this.tournamentDetails.matches.length - 1].winner;
        this.tournamentDetails.numberOfRounds = Math.log2(this.tournamentDetails?.teams.length);
      },
    },
  },

  methods: {
    getTeamName: function (teamId) {
      return utils.getTeamNameById(teamId, this.tournamentDetails.teams);
    },
    getRoundStringFromMatchIdx: function (idx) {
      return (
        "(Round " +
        Math.ceil(
          Math.log2(this.tournamentDetails?.teams.length) - Math.log2(this.tournamentDetails?.matches.length - idx)
        ) +
        ") "
      );
    },
    getGroupOrRoundStringFromMatchIdx: function (idx) {
      const numberOfMatchesInGroup = 6; /* combined tournament is prepared for groups of 4 teams */
      const numberOfGroups = this.tournamentDetails?.teams.length / 4;
      if (idx < numberOfMatchesInGroup * numberOfGroups)
        return "(Group " + String.fromCharCode(Math.floor(idx / numberOfMatchesInGroup) + 65) + ") ";

      const roundNumber = Math.ceil(
        Math.log2(this.tournamentDetails?.teams.length / 2) - Math.log2(this.tournamentDetails?.matches.length - idx)
      );
      return "(Round " + roundNumber + ") ";
    },
    areAllGroupMatchesFinished: function (groupScores, numberOfOneTeamMatches) {
      for (const team of groupScores) {
        if (team.matchesWon + team.matchesLost != numberOfOneTeamMatches) {
          return false;
        }
      }
      return true;
    },
  },

  computed: {
    isSingleEliminationTournament: function () {
      return this.tournamentDetails.type == types.TournamentType.SINGLE_ELIMINATION;
    },
    isAllVsAllTournament: function () {
      return this.tournamentDetails.type == types.TournamentType.ALL_VS_ALL;
    },
    isCombinedTournament: function () {
      return this.tournamentDetails.type == types.TournamentType.COMBINED;
    },
  },

  created: async function () {
    await tournamentApi.collectTournamentByID(this.$route.params.id, this.tournamentDetails).then(() => {
      teamApi.getUserById(this.tournamentDetails.creatorId).then((creator) => {
        this.tournamentDetails.creator = creator;
      });

      let teamsPromises = [];
      for (let i = 0; i < this.tournamentDetails.teamsId.length; ++i) {
        teamsPromises.push(teamApi.getTeamByID(this.tournamentDetails.teamsId[i]));
      }
      Promise.all(teamsPromises).then((teams) => {
        this.tournamentDetails.teams = teams;
      });

      let matchPromises = [];
      for (let i = 0; i < this.tournamentDetails.matchesId.length; ++i) {
        matchPromises.push(matchApi.getMatchByID(this.tournamentDetails.matchesId[i]));
      }
      Promise.all(matchPromises).then((matches) => {
        this.tournamentDetails.matches = matches;
        if (
          this.tournamentDetails.type == types.TournamentType.SINGLE_ELIMINATION &&
          this.tournamentDetails.winner == "" &&
          matches[matches.length - 1].winner !== ""
        ) {
          this.tournamentDetails.winner = matches[matches.length - 1].winner;
          tournamentApi.updateTournament(this.tournamentDetails.id, {
            winner: this.tournamentDetails.winner,
            status: types.TournamentStatus.FINISHED,
          });
        } else if (this.tournamentDetails.type == types.TournamentType.ALL_VS_ALL) {
          this.tournamentDetails.scoreTable = objectGenerators.createScoreTableForRoundRobin(
            this.tournamentDetails.teams,
            this.tournamentDetails.matches
          );
          if (
            this.areAllGroupMatchesFinished(this.tournamentDetails.scoreTable, this.tournamentDetails.teams.length - 1) &&
            this.tournamentDetails.winner == ""
          ) {
            this.tournamentDetails.winner = this.tournamentDetails.scoreTable[0].name;
            tournamentApi.updateTournament(this.tournamentDetails.id, {
              winner: this.tournamentDetails.winner,
              status: types.TournamentStatus.FINISHED,
            });
          }
        } else if (this.tournamentDetails.type == types.TournamentType.COMBINED) {
          for (let i = 0; i < this.tournamentDetails.teams.length / 4; ++i) {
            this.tournamentDetails.scoreTable.push(
              objectGenerators.createScoreTableForRoundRobin(
                this.tournamentDetails.teams.slice(i * 4, i * 4 + 4),
                this.tournamentDetails.matches.slice(i * 6, i * 6 + 6)
              )
            );
          }

          const numberOfGroupMatches = 6 * (this.tournamentDetails?.teams.length / 4);
          const numberOfFirstRoundMatches = this.tournamentDetails?.teams.length / 4;
          for (let [idx, groupScores] of this.tournamentDetails.scoreTable.entries()) {
            if (this.areAllGroupMatchesFinished(groupScores, 3)) {
              const nextIndexForFirstPlace = numberOfGroupMatches + idx;
              if (this.tournamentDetails.matches[nextIndexForFirstPlace].firstTeam == "")
                matchApi.updateMatch(this.tournamentDetails.matchesId[nextIndexForFirstPlace], {
                  first_team: groupScores[0].id,
                });

              const nextIndexForSecondPlace = numberOfGroupMatches + numberOfFirstRoundMatches - idx - 1;
              if (this.tournamentDetails.matches[nextIndexForSecondPlace].secondTeam == "")
                matchApi.updateMatch(this.tournamentDetails.matchesId[nextIndexForSecondPlace], {
                  second_team: groupScores[1].id,
                });
            }
          }
          if (
            this.tournamentDetails.winner == "" &&
            this.tournamentDetails.matches[this.tournamentDetails.matches.length - 1].winner !== ""
          ) {
            this.tournamentDetails.winner =
              this.tournamentDetails.matches[this.tournamentDetails.matches.length - 1].winner;
            tournamentApi.updateTournament(this.tournamentDetails.id, {
              winner: this.tournamentDetails.winner,
              status: types.TournamentStatus.FINISHED,
            });
          }
        }
      });
    });
  },
};
</script>
