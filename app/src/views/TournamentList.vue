<template>
  <div>
    <h1>Tournament</h1>
    <table class="table table-dark table-striped text-center align-middle">
      <thead>
        <tr>
          <th style="width: 30%" class="text-start">Tournament</th>
          <th style="width: 10%">Type</th>
          <th style="width: 10%">Status</th>
          <th style="width: 30%" class="text-start">Teams</th>
          <th style="width: 20%">Winner</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tournament in filteredTournaments" :key="tournament.id">
          <td class="text-start">
            <router-link :to="'/tournament/' + tournament.id">
              <!-- <router-link :to="'/'"> -->
              {{ tournament.name }}
            </router-link>
            {{ tournament.is_private }}
          </td>
          <td>{{ tournament.type }}</td>
          <td>{{ tournament.status }}</td>
          <td class="text-start">
            <template v-for="(n, index) in tournament.teams" :key="index" class="mb-0 mt-0">
              {{ tournament.teams[index] + ", " }}
            </template>
          </td>
          <td>{{ this.getWinnerIfNotEmpty(tournament.winner) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import tournamentApi from "../api/tournamentApi";

export default {
  name: "Tournament",

  data: function () {
    return {
      allTournaments: [],
      filteredTournaments: [],
    };
  },

  methods: {
    getWinnerIfNotEmpty: function (entry) {
      return entry ? entry : "No winner yet :)";
    },
    shouldTournamentAppearOnList: function (tournament) {
      return !tournament.is_private || tournament.creator === this.$store.state.$user.uid;
    }
  },

  computed: {
  },

  created: async function () {
    await tournamentApi.collectAllTournaments(this.allTournaments);
    this.filteredTournaments = this.allTournaments.filter((x) => {
      console.log(x);
      return this.shouldTournamentAppearOnList(x)
    });
  },

  mounted: function () {
  }
};
</script>
