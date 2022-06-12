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
        <h2>Teams attending</h2>
        <ul>
          <li v-for="(team, i) in this.tournamentDetails.teams" :key="i">
            {{ team.name }}
          </li>
        </ul>
      </div>
      <div class="col-6">
        <h2>Matches</h2>
        <ul>
          <li v-for="(match, i) in this.tournamentDetails.matches" :key="i">
            <router-link :to="'/tournament/matches/' + tournamentDetails.matchesId[i]"
             v-if="getTeamName(match.firstTeam) != 'TBD' && getTeamName(match.secondTeam) != 'TBD'">
              {{ this.getTeamName(match.firstTeam) + " vs. " + this.getTeamName(match.secondTeam) }}
            </router-link>
            <div v-else-if="getTeamName(match.firstTeam) != 'TBD' && getTeamName(match.secondTeam) == 'TBD'">
              {{ getTeamName(match.firstTeam) }} vs. TBD
            </div>
            <div v-else-if="getTeamName(match.firstTeam) == 'TBD' && getTeamName(match.secondTeam) != 'TBD'">
              TBD vs. {{ getTeamName(match.secondTeam) }}
            </div>
            <div v-else>
              TBD vs. TBD
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import tournamentApi from "../api/tournamentApi";
import teamApi from "../api/teamApi";
import matchApi from "../api/matchApi";
import utils from "../services/utils";

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
      },
    };
  },

  methods: {
    getTeamName: function (teamId) {
      return utils.getTeamNameById(teamId, this.tournamentDetails.teams);
    },
  },

  created: async function () {
    tournamentApi.collectTournamentByID(this.$route.params.id, this.tournamentDetails).then(() => {
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
      });
    });
  },
};
</script>
