<template>
  <div>
    <h1>Tournament</h1>
    <div class="row">
      <h2>Create a Tournament</h2>
      <div class="col-6">
        <form>
          <div class="form-group mb-3">
            <label>Name of the tournament</label>
            <input class="form-control" placeholder="Your tournament's name" v-model="createTournamentForm.name" />
          </div>
          <div class="form-group mb-3">
            <label>Type of the tournament</label>
            <select v-model="createTournamentForm.type" class="form-select">
              <option selected="selected" disabled>Select the type of the tournament</option>
              <option v-for="type in tournamentTypes" v-bind:key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <div v-if="isSingleEliminationTournament" class="form-text text-muted">
              Number of teams for Single Elimination Tournament should be the bigger than 4 and the power of 2 (4, 8,
              etc.)
            </div>
            <div v-else-if="isCombinedTournament" class="form-text text-muted">
              Number of teams for Combined Tournament should be the bigger than 8 and the power of 2 (8, 16, etc.)
            </div>
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
        </form>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Add teams to the tournament (selected {{ createTournamentForm.teams.length }} teams)</label>
          <select
            multiple
            v-model="createTournamentForm.teams"
            size="15"
            class="form-select"
            aria-label="Default select example"
          >
            <option v-for="team in allTeams" v-bind:key="team.id" :value="team.id">
              {{ team.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="col-12 text-center align-middle mt-3">
      <button
        v-if="isSingleEliminationTournament"
        @click="createSingleEliminationTournament"
        :disabled="!isValidSingleEliminationTournament"
        type="submit"
        class="btn btn-light"
      >
        Create Single Elimination Tournament
      </button>
      <button
        v-if="isAllVsAllTournament"
        @click="createAllVsAllTournament"
        :disabled="!isValidAllVsAllTournament"
        type="submit"
        class="btn btn-light"
      >
        Create All Versus All Tournament
      </button>
      <button
        v-if="isCombinedTournament"
        @click="createCombinedTournament"
        :disabled="!isValidCombinedTournament"
        type="submit"
        class="btn btn-light"
      >
        Create Combined Tournament
      </button>
    </div>
  </div>
</template>

<script>
import tournamentApi from "../api/tournamentApi";
import teamApi from "../api/teamApi";
import types from "../services/types";
import utils from "../services/utils";

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
    createSingleEliminationTournament: async function (event) {
      event.preventDefault();
      await tournamentApi.createSingleEliminationTournament(this.createTournamentForm, this.$router);
    },
    createAllVsAllTournament: async function (event) {
      event.preventDefault();
      await tournamentApi.createAllVsAllTournament(this.createTournamentForm, this.$router);
    },
    createCombinedTournament: async function (event) {
      event.preventDefault();
      await tournamentApi.createCombinedTournament(this.createTournamentForm, this.$router);
    },
    isPowerOfTwo: function () {
      return utils.isPowerOfTwo(this.createTournamentForm.teams.length);
    },
  },

  computed: {
    isSingleEliminationTournament: function () {
      return this.createTournamentForm.type == types.TournamentType.SINGLE_ELIMINATION;
    },
    isAllVsAllTournament: function () {
      return this.createTournamentForm.type == types.TournamentType.ALL_VS_ALL;
    },
    isCombinedTournament: function () {
      return this.createTournamentForm.type == types.TournamentType.COMBINED;
    },
    isValidSingleEliminationTournament: function () {
      return this.createTournamentForm.teams.length >= 4 && this.isPowerOfTwo();
    },
    isValidAllVsAllTournament: function () {
      return this.createTournamentForm.teams.length >= 2;
    },
    isValidCombinedTournament: function () {
      return this.createTournamentForm.teams.length >= 8 && this.isPowerOfTwo();
    },
  },

  created: function () {
    teamApi.collectTeams(this.allTeams);
  },
};
</script>
