<template>
  <div>
    <h1>Tournament</h1>
    <table class="table table-dark table-striped text-center align-middle">
      <thead>
        <tr>
          <th style="width: 40%" class="text-start">Tournament</th>
          <th style="width: 20%">Type</th>
          <th style="width: 15%">Status</th>
          <th style="width: 20%">Winner</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tournament in filteredTournaments" :key="tournament.id">
          <td class="text-start">
            <router-link :to="'/tournament/' + tournament.id">
              {{ tournament.name }}
            </router-link>
          </td>
          <td>{{ tournament.type }}</td>
          <td>{{ tournament.status }}</td>
          <td>{{ this.getWinnerIfNotEmpty(tournament.winner) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import tournamentApi from "../api/tournamentApi";

/**
 * @vue-data {Array} allTournaments - List of all tournaments fetched from database
 * @vue-data {Array} filteredTournaments - List of filtered tournaments by the visibility
 * @vue-event {string} getWinnerIfNotEmpty - Returns name of the winner of the match if
 *                                           the winner is known
 * @vue-event {Boolean} shouldTournamentAppearOnList - Checks if the tournament is private
 *                                                     and should not be displayed on the
 *                                                     list. It displays ALL tournaments
 *                                                     created by currently logged-in user.
 */
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
      return entry ? entry : "No winner yet";
    },
    shouldTournamentAppearOnList: function (tournament) {
      return !tournament.is_private || tournament.creator === this.$store.state.$user?.uid;
    }
  },

  created: async function () {
    await tournamentApi.collectAllTournaments(this.allTournaments);
    this.filteredTournaments = this.allTournaments.filter((x) => {
      return this.shouldTournamentAppearOnList(x)
    });
  }
};
</script>
