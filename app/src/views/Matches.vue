<template>
  <div>
    <h1>Matches</h1>
    <table style="table-layout: fixed" class="table table-dark table-striped text-center align-middle">
      <thead class="align-middle">
        <tr>
          <th style="width: 20%">Team A</th>
          <th style="width: 20%">Team B</th>
          <th style="width: 8%">Match Type</th>
          <th style="width: 37%">Results</th>
          <th style="width: 15%">Winner</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in filteredMatches" :key="match.id">
          <td>{{ getTeamNameById(match.first_team) }}</td>
          <td>{{ getTeamNameById(match.second_team) }}</td>
          <td>{{ "Best Of " + match.match_type }}</td>
          <td>
            <table class="table table-borderless table-white-text mb-0">
              <tbody style="table-layout: fixed">
                <tr>
                  <template v-if="match.scores.length > 0">
                    <td v-for="(n, index) in match.scores.length" :key="index" :style="'width: ' + 100 / match.scores.length + '%'">
                      {{ match.maps[index] != "" ? match.maps[index] : "Not selected" }}
                    </td>
                  </template>
                  <template v-else>
                    Maps not selected
                  </template>
                </tr>
                <tr>
                  <template v-if="match.scores.length > 0">
                    <td v-for="(n, index) in match.scores.length" :key="index" :style="'width: ' + 100 / match.scores.length + '%'">
                      {{ this.getScoreIfExists(match, index) }}
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </td>
          <td>{{ match.winner != "" ? match.winner : "No winner yet" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import matchApi from "../api/matchApi";
import teamApi from "../api/teamApi";
import utils from "../services/utils";

/**
 * @vue-data {Array} [allMatches=[]] - All matches fetched from the database
 * @vue-data {Array} [filteredMatches=[]] - Filtered matches using event shouldMatchAppearOnList
 * @vue-data {Array} [allTeams=[]] - All teams fetched from the database used to print the name of the teams in match
 * @vue-event {string} getScoreIfExists - Gets score of the match if it is not null
 * @vue-event {string} getTeamNameById - Calls utils function to get the team's name
 * @vue-event {Boolean} shouldMatchAppearOnList - Checks if the match has both teams assigned
 * @vue-event {void} created - Hook fetching teams and matches, then filtering matches
 *                             based on the name of the team
 */
export default {
  name: "Matches",

  data: function () {
    return {
      allMatches: [],
      filteredMatches: [],
      allTeams: [],
    };
  },

  methods: {
    getScoreIfExists: function (match, index) {
      if ("scores" in match) {
        if (match.scores[index].first_team_score && match.scores[index].second_team_score)
          return match.scores[index].first_team_score + ":" + match.scores[index].second_team_score;
        else return "-:-";
      }
      return "Not played yet";
    },
    getTeamNameById: function (teamId) {
      return utils.getTeamNameById(teamId, this.allTeams);
    },
    shouldMatchAppearOnList: function (match) {
      return match.first_team != "" && match.second_team != "";
    },
  },

  created: async function () {
    await teamApi.collectTeams(this.allTeams);
    await matchApi.collectAllMatches(this.allMatches).then(() => {
      this.filteredMatches = this.allMatches.filter((match) => {
        return this.shouldMatchAppearOnList(match);
      });
    });
  },
};
</script>

<style scoped>
.table-white-text {
  color: white;
}
</style>
