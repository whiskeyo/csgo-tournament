<template>
  <div>
    <h1>Matches</h1>
    <table class="table table-dark table-striped text-center align-middle">
      <thead class="align-middle">
        <tr>
          <th style="width: 15%">Team A</th>
          <th style="width: 15%">Team B</th>
          <th style="width: 10%">Match Type</th>
          <th style="width: 45%">Results</th>
          <th style="width: 15%">Winner</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in allMatches" :key="match.id">
          <td>{{ match.first_team }}</td>
          <td>{{ match.second_team }}</td>
          <td>{{ "Best Of " + match.match_type }}</td>
          <td>
            <table class="table table-borderless table-white-text mb-0">
              <tbody>
                <tr>
                  <td v-for="(n, index) in match.match_type" :key="index">
                    {{ (match.maps[index] != "") ? match.maps[index] : "Not selected" }}
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
          <td>{{ match.winner }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import matchApi from "../api/matchApi";

export default {
  name: "Matches",

  data: function () {
    return {
      allMatches: [],
    };
  },

  methods: {
    xd: function () {
      const fieldsToChange = {
        scores: [
          matchApi.createScoreObject(16, 3, 0, 0),
          matchApi.createScoreObject(12, 16, 0, 0),
          matchApi.createScoreObject(16, 8, 0, 0),
        ],
      };
      const matchId = "YDpWjFtuC8XTIT1GiLyP";
      matchApi.updateMatch(matchId, fieldsToChange);
    },
    getScoreIfExists(match, index) {
      if ("scores" in match) {
        if (match.scores[index] && match.scores[index])
          return match.scores[index].first_team_score + ":" + match.scores[index].second_team_score;
        else return "-:-";
      }
      return "Not played yet";
    },
  },

  created: function () {
    // matchApi.createMatch();
    // this.xd();
    matchApi.collectAllMatches(this.allMatches);
  },
};
</script>

<style scoped>
.table-white-text {
  color: white;
}
</style>
