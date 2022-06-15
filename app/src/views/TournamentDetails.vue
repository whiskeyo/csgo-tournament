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
        <div v-if="!isAllVsAllTournament">
          <h2>Teams attending</h2>
          <ul>
            <li v-for="(team, i) in this.tournamentDetails.teams" :key="i">
              {{ team.name }}
            </li>
          </ul>
        </div>
        <div v-else>
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
                <td class="text-center">{{ idx + 1}}</td>
                <td class="text-start"> {{ score.name }}</td>
                <td class="text-center"> {{ score.matchesWon }}</td>
                <td class="text-center"> {{ score.matchesLost }}</td>
                <td class="text-center"> {{ score.roundsWon }}</td>
                <td class="text-center"> {{ score.roundsLost }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-6">
        <h2>Matches</h2>
        <ul>
          <li v-for="(match, i) in this.tournamentDetails?.matches" :key="i">
            <router-link
              :to="'/tournament/matches/' + tournamentDetails.matchesId[i]"
              v-if="getTeamName(match.firstTeam) != 'TBD' && getTeamName(match.secondTeam) != 'TBD'"
            >
              {{ this.getTeamName(match.firstTeam) + " vs. " + this.getTeamName(match.secondTeam) }}
            </router-link>
            <div v-else-if="getTeamName(match.firstTeam) != 'TBD' && getTeamName(match.secondTeam) == 'TBD'">
              {{ getTeamName(match.firstTeam) }} vs. TBD
            </div>
            <div v-else-if="getTeamName(match.firstTeam) == 'TBD' && getTeamName(match.secondTeam) != 'TBD'">
              TBD vs. {{ getTeamName(match.secondTeam) }}
            </div>
            <div v-else>TBD vs. TBD</div>
          </li>
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
      },
    };
  },

  watch: {
    tournamentDetails: {
      depp: true,
      handler: function () {
        this.tournamentDetails.winner =
          this.tournamentDetails.matches[this.tournamentDetails.matches.length - 1].winner;
      },
    },
  },

  methods: {
    getTeamName: function (teamId) {
      return utils.getTeamNameById(teamId, this.tournamentDetails.teams);
    },
  },

  computed: {
    isAllVsAllTournament: function () {
      return this.tournamentDetails.type == types.TournamentType.ALL_VS_ALL;
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
        }

        if (this.tournamentDetails.type == types.TournamentType.ALL_VS_ALL) {
          this.tournamentDetails.scoreTable = objectGenerators.createScoreTableForRoundRobin(
            this.tournamentDetails.teams,
            this.tournamentDetails.matches
          );
          console.log("scoreTable: ", this.tournamentDetails.scoreTable);
        }
      });
    });
  },
};
</script>
