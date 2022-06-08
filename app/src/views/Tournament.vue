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
        <tr v-for="tournament in allTournaments" :key="tournament.id">
          <td class="text-start">{{ tournament.name }}</td>
          <td>{{ tournament.type }}</td>
          <td>{{ tournament.status }}</td>
          <td class="text-start">
            <template v-for="(n, index) in tournament.teams" :key="index" class="mb-0 mt-0">
              {{ tournament.teams[index] + ", " }}
            </template>
          </td>
          <td>{{ this.getWinnerIfNotEmpty(tournament.winner) }}</td>
          <!-- <td>
            <template>

            </template>
            <table class="table table-white-text mb-0">
              <tbody>
                <tr>
                  <td v-for="(n, index) in match.match_type" :key="index">
                    {{ match.maps[index] }}
                  </td>
                </tr>
                <tr>
                  <td v-for="(n, index) in match.match_type" :key="index">
                    {{ this.getScoreIfExists(match, index) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>{{ match.winner }}</td> -->
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
    };
  },

  methods: {
    getWinnerIfNotEmpty: function (entry) {
      return entry ? entry : "No winner yet :)";
    }
  },

  computed: {
  },

  created: function () {
    tournamentApi.collectAllTournaments(this.allTournaments);
    // tournamentApi.createTournament();
    // this.fetchMaps();
  },
};
</script>
