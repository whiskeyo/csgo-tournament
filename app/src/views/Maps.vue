<template>
  <div>
    <h1>Maps</h1>
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th style="width: 25%">Map</th>
          <th style="width: 25%">Matches played</th>
          <th style="width: 25%">Rounds won by T</th>
          <th style="width: 25%">Rounds won by CT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="map in allMaps" :key="map.name">
          <td>{{ map.name }}</td>
          <td>{{ map.matchesPlayed }}</td>
          <td>{{ map.roundsWonByT + calculatePercentOfRounds(map.roundsWonByT, map.roundsWonByT + map.roundsWonByCt)}}</td>
          <td>{{ map.roundsWonByCt + calculatePercentOfRounds(map.roundsWonByCt, map.roundsWonByT + map.roundsWonByCt)}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import mapsApi from "../api/mapsApi";

export default {
  name: "Maps",

  data: function () {
    return {
      allMaps: [],
    };
  },

  methods: {
    calculatePercentOfRounds(roundsWonOnOneSide, roundsTogether) {
      if (roundsTogether == 0)
        return "";

      return " (" + (roundsWonOnOneSide / roundsTogether * 100).toFixed(1) + "%)"
    }
  },

  created: function () {
    mapsApi.collectMaps(this.allMaps);
  },
};
</script>
