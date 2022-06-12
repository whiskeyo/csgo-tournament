<template>
  <div>
    <h1>Tournament</h1>
    <div class="row">
      <h2>Create a Tournament</h2>
      <div class="col-6">
        <form @submit="createTournament">
          <div class="form-group mb-3">
            <label>Name of the tournament</label>
            <input class="form-control" placeholder="Your team name" v-model="createTournamentForm.name" />
          </div>
          <div class="form-group">
            <label>Add teams to the tournament (selected {{ createTournamentForm.teams.length }} teams)</label>
            <select
              multiple
              v-model="createTournamentForm.teams"
              size="15"
              class="form-select"
              aria-label="Default select example"
            >
              <option disabled>Select multiple teams (# of teams must be the power of 2)</option>
              <option v-for="team in allTeams" v-bind:key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>
          <input type="submit" value="Create!" />
        </form>
      </div>
      <div class="col-6">
        <div class="form-group mb-3">
          <label>Type of the tournament</label>
          <select v-model="createTournamentForm.type" class="form-select">
            <option disabled>Select the type of the tournament</option>
            <option v-for="type in tournamentTypes" v-bind:key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label>Type of matches played</label>
          <select v-model="createTournamentForm.matchType" class="form-select">
            <option disabled>Select the type of matches played</option>
            <option v-for="type in matchTypes" v-bind:key="type" :value="type">
              {{ "Best Of " + type }}
            </option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label>Should the tournament be hidden</label>
          <select v-model="createTournamentForm.isPrivate" class="form-select">
            <option :value="true">Yes</option>
            <option selected :value="false">No</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tournamentApi from "../api/tournamentApi";
import teamApi from "../api/teamApi";
import types from "../services/types";

export default {
  name: "TournamentCreate",

  data: function () {
    return {
      createTournamentForm: {
        name: "",
        creator: this.$store.state.$user.uid,
        teams: [],
        type: null,
        matchType: null,
        isPrivate: false,
      },
      allTeams: [],
      tournamentTypes: types.TournamentType,
      matchTypes: types.MatchType,
    };
  },

  methods: {
    createTournament: async function (event) {
      await tournamentApi.createTournament(this.createTournamentForm, event).then((tournamentId) => {
        this.$router.push("/tournament/" + tournamentId);
      });
    }
  },

  computed: {},

  created: function () {
    teamApi.collectTeams(this.allTeams);
  },
};
</script>
