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
          <h2 v-if="isAllVsAllTournament">Score Table</h2>
          <h2 v-else-if="isCombinedTournament">Score Tables</h2>
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
      <div class="col-2"></div>
      <div class="col-4">
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
        console.log(matches);
        if (
          this.tournamentDetails.type == types.TournamentType.SINGLE_ELIMINATION &&
          this.tournamentDetails.winner == "" &&
          matches[matches.length - 1].winner !== ""
        ) {
          this.tournamentDetails.winner = matches[matches.length - 1].winner;
          tournamentApi.updateTournament(this.tournamentDetails.id, { winner: this.tournamentDetails.winner });
        } else if (this.tournamentDetails.type == types.TournamentType.ALL_VS_ALL) {
          this.tournamentDetails.scoreTable = objectGenerators.createScoreTableForRoundRobin(
            this.tournamentDetails.teams,
            this.tournamentDetails.matches
          );
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
          for (let [idx, groupScore] of this.tournamentDetails.scoreTable.entries()) {
            for (const teamScore of groupScore) {
              if (teamScore.matchesWon + teamScore.matchesLost == 3) {
                if (this.tournamentDetails.matchesId[numberOfGroupMatches + idx].first_team != "")
                  matchApi.updateMatch(this.tournamentDetails.matchesId[numberOfGroupMatches + idx], {
                    first_team: groupScore[0].id,
                  });

                if (
                  this.tournamentDetails.matchesId[numberOfGroupMatches + numberOfFirstRoundMatches - idx - 1]
                    .second_team != ""
                )
                  matchApi.updateMatch(
                    this.tournamentDetails.matchesId[numberOfGroupMatches + numberOfFirstRoundMatches - idx - 1],
                    { second_team: groupScore[1].id }
                  );
              }
            }
          }
        }
      });
    });
  },
};
</script>
