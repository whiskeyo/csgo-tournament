<template>
  <div>
    <h1>Match Room</h1>
    <div class="row">
      <h2>
        {{ this.matchDetails?.firstTeam?.name + " versus " + this.matchDetails?.secondTeam?.name }}
      </h2>
      <div class="col-4 text-center">
        <h3>{{ this.matchDetails?.firstTeam?.name }}</h3>
        <ul class="list-group text-start mb-2">
          <li class="list-group-item list-group-item-primary fw-bold">
            Captain: {{ this.matchDetails.firstTeam.captain?.nickname }}
          </li>
        </ul>
        <ul class="list-group text-start">
          <li
            v-for="member in matchDetails.firstTeam.members"
            :key="member.uid"
            class="list-group-item list-group-item-dark"
          >
            {{ member.nickname }} <br />
            ({{ member.fullname }})
          </li>
        </ul>
      </div>
      <div class="col-4 text-center">
        <div v-if="matchDetails.allMaps.length">
          <h3>Maps</h3>
          <ul class="list-group">
            <li
              v-for="map in matchDetails.allMaps"
              :key="map.id"
              class="list-group-item list-group-item-dark list-group-item-action"
              @click="changeMapState(map)"
            >
              {{ map.name }}
            </li>
          </ul>
        </div>
        <h3 v-if="matchDetails.maps.length">Selected Maps</h3>
        <ul v-if="matchDetails.maps.length < matchDetails.matchType" class="list-group">
          <li v-for="map in matchDetails.maps" :key="map" class="list-group-item list-group-item-success fw-bold">
            {{ map }}
          </li>
        </ul>
        <ul v-else class="list-group">
          <li
            v-for="(map, idx) in matchDetails.maps"
            :key="map"
            class="list-group-item list-group-item-success fw-bold"
          >
            <table style="table-layout: fixed" class="table text-center align-middle mb-0">
              <thead class="align-middle">
                <tr>
                  <th style="width: 30%" class="text-start no-wrap ps-0">{{ map }}</th>
                  <th style="width: 15%" class="text-center">
                    <input
                      v-model="matchDetails.scores[idx].first_team_score"
                      class="form-control form-control-sm text-center m-0 p-0"
                      style="width: 100%"
                      type="text"
                      name="firstTeamScore"
                      :id="'firstTeamScore' + idx"
                      placeholder="&#x2190;"
                    />
                  </th>
                  <th style="width: 15%">
                    <input
                      v-model="matchDetails.scores[idx].second_team_score"
                      class="form-control form-control-sm text-center m-0 p-0"
                      style="width: 100%"
                      type="text"
                      name="secondTeamScore"
                      :id="'secondTeamScore' + idx"
                      placeholder="&#x2192;"
                    />
                  </th>
                  <th style="width: 15%">
                    <input
                      v-model="matchDetails.scores[idx].rounds_won_by_ct"
                      class="form-control form-control-sm text-center m-0 p-0"
                      style="width: 100%"
                      type="text"
                      name="roundsWonByCt"
                      :id="'roundsWonByCt' + idx"
                      placeholder="CT"
                    />
                  </th>
                  <th style="width: 15%">
                    <input
                      v-model="matchDetails.scores[idx].rounds_won_by_t"
                      class="form-control form-control-sm text-center m-0 p-0"
                      style="width: 100%"
                      type="text"
                      name="roundsWonByT"
                      :id="'roundsWonByT' + idx"
                      placeholder="T"
                    />
                  </th>
                  <!-- <th style="width: 10%">
                    <button @click="updateScore" type="button" class="btn btn-dark btn-sm">&#128504;</button>
                  </th> -->
                </tr>
              </thead>
            </table>
            <!-- {{ map }}  ({{ idx }}) -->
          </li>
          <li class="list-group-item list-group-item-success text-center">
            <button @click="updateScore" type="button" class="btn btn-dark">Save scores</button>
          </li>
          <li class="list-group-item list-group-item-success smaller text-start">
            1st box: score of {{ this.matchDetails?.firstTeam?.name }} <br />
            2nd box: score of {{ this.matchDetails?.secondTeam?.name }} <br />
            3rd box: rounds won by both teams on CT side <br />
            4th box: rounds won by both teams on T side <br />
          </li>
        </ul>
        <h3 v-if="matchDetails.mapsBanned.length">Banned Maps</h3>
        <ul class="list-group">
          <li v-for="map in matchDetails.mapsBanned" :key="map" class="list-group-item list-group-item-danger">
            {{ map }}
          </li>
        </ul>
        <div v-if="matchDetails.actionsTakenOnMaps < 7">
          {{ this.matchDetails.phaseInfo }}, turn of player:
          <div v-if="matchDetails.actionsTakenOnMaps % 2 == 0">
            {{ this.matchDetails.firstTeam?.captain?.nickname }}
          </div>
          <div v-else>
            {{ this.matchDetails.secondTeam?.captain?.nickname }}
          </div>
        </div>
      </div>
      <div class="col-4 text-center">
        <h3>{{ this.matchDetails?.secondTeam?.name }}</h3>
        <ul class="list-group text-end mb-2">
          <li class="list-group-item list-group-item-primary fw-bold">
            Captain: {{ this.matchDetails?.secondTeam?.captain?.nickname }}
          </li>
        </ul>
        <ul class="list-group text-end">
          <li
            v-for="member in matchDetails.secondTeam.members"
            :key="member.uid"
            class="list-group-item list-group-item-dark"
          >
            {{ member.nickname }} <br />
            ({{ member.fullname }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import teamApi from "../api/teamApi";
import matchApi from "../api/matchApi";
import mapsApi from "../api/mapsApi";
import utils from "../services/utils";
import { db } from "../configs/db";
import { doc, onSnapshot } from "firebase/firestore";

export default {
  name: "MatchRoom",

  data: function () {
    return {
      matchDetails: {
        id: this.$route.params.id,
        firstTeamId: "",
        secondTeamId: "",
        winnerId: "",
        matchType: null,
        maps: [],
        mapsBanned: [],
        scores: [],
        firstTeamMapWins: 0,
        secondTeamMapWins: 0,
        firstTeam: {
          name: "",
          captainId: "",
          membersId: [],
          captain: { nickname: "", fullname: "", email: "", uid: "" },
          members: [{ email: "", fullname: "", nickname: "", uid: "" }],
        },
        secondTeam: {
          name: "",
          captainId: "",
          membersId: [],
          captain: { nickname: "", fullname: "", email: "", uid: "" },
          members: [{ email: "", fullname: "", nickname: "", uid: "" }],
        },
        winner: "",
        allMaps: [],
        actionsTakenOnMaps: 0,
        phaseInfo: "Banning maps",
        currentMatchIndex: null,
        lastMatchIndex: null,
        nextMatchId: null,
      },
    };
  },

  watch: {
    matchDetails: {
      deep: true,
      handler: function () {
        this.matchDetails.actionsTakenOnMaps = this.matchDetails.maps.length + this.matchDetails.mapsBanned.length;
      },
    },
  },

  methods: {
    changeMapState: function (map) {
      if (utils.canFirstCaptainTakeActionOnMap(this.matchDetails, this.$store)) return;
      if (utils.canSecondCaptainTakeActionOnMap(this.matchDetails, this.$store)) return;

      utils.setMapState(map, this.matchDetails);
      this.matchDetails.phaseInfo = utils.setBanningAndPickingPhase(
        this.matchDetails.actionsTakenOnMaps,
        this.matchDetails.matchType
      );

      matchApi.updateMatch(this.$route.params.id, {
        maps: this.matchDetails.maps,
        maps_banned: this.matchDetails.mapsBanned,
        scores: this.matchDetails.scores,
      });
    },

    updateScore: async function () {
      this.matchDetails.firstTeamMapWins = utils.getNumberOfMapsWonByFirstTeam(this.matchDetails);
      this.matchDetails.secondTeamMapWins = utils.getNumberOfMapsWonBySecondTeam(this.matchDetails);
      this.matchDetails.winner = utils.determineWinner(this.matchDetails);

      let maps = [];
      maps = await mapsApi.collectMaps(maps).then(() => {
        for (let mapIdx = 0; mapIdx < this.matchDetails.maps.length; ++mapIdx) {
          for (const mapObject of maps) {
            if (this.matchDetails.maps[mapIdx] == mapObject.name) {
              mapsApi.updateMap(mapObject.id, {
                matches_played: mapObject.matchesPlayed + 1,
                rounds_won_by_ct: Number(mapObject.roundsWonByCt) + Number(this.matchDetails.scores[mapIdx]?.rounds_won_by_ct),
                rounds_won_by_t: Number(mapObject.roundsWonByT) + Number(this.matchDetails.scores[mapIdx]?.rounds_won_by_t),
              });
            }
          }
        }
      });

      await matchApi.updateMatch(this.$route.params.id, {
        scores: this.matchDetails.scores,
        first_team_map_wins: this.matchDetails.firstTeamMapWins,
        second_team_map_wins: this.matchDetails.secondTeamMapWins,
        winner: this.matchDetails.winner,
      });

      if (this.matchDetails.winner != "" && this.matchDetails.currentMatchIndex < this.matchDetails.lastMatchIndex) {
        const winnerId =
          this.matchDetails.firstTeam.name == this.matchDetails.winner
            ? this.matchDetails.firstTeamId
            : this.matchDetails.secondTeamId;

        const nextMatchSlot = this.matchDetails.currentMatchIndex % 2 == 0 ? "first_team" : "second_team";

        const fieldsToChange = {};
        fieldsToChange[nextMatchSlot] = winnerId;

        await matchApi.updateMatch(this.matchDetails.nextMatchId, fieldsToChange);
      }
    },
  },

  beforeCreate: async function () {
    await matchApi
      .getMatchByID(this.$route.params.id)
      .then((match) => {
        this.matchDetails.id = this.$route.params.id;
        this.matchDetails.firstTeamId = match.firstTeam;
        this.matchDetails.secondTeamId = match.secondTeam;
        this.matchDetails.winnerId = match.winner;
        this.matchDetails.matchType = match.matchType;
        this.matchDetails.maps = match.maps;
        this.matchDetails.mapsBanned = match.mapsBanned;
        this.matchDetails.scores = match.scores;
        this.matchDetails.firstTeamMapWins = match.firstTeamMapWins;
        this.matchDetails.secondTeamMapWins = match.secondTeamMapWins;
        this.matchDetails.currentMatchIndex = match.currentMatchIndex;
        this.matchDetails.nextMatchId = match.secondTeamMapWins;
        this.matchDetails.lastMatchIndex = match.lastMatchIndex;
      })
      .then(async () => {
        teamApi.getTeamByID(this.matchDetails.firstTeamId).then(async (firstTeam) => {
          this.matchDetails.firstTeam = firstTeam;
          let firstTeamPromises = [];
          for (let i = 0; i < this.matchDetails.firstTeam.membersId.length; ++i) {
            firstTeamPromises.push(teamApi.getUserById(this.matchDetails.firstTeam.membersId[i]));
          }
          await Promise.all(firstTeamPromises).then((members) => {
            this.matchDetails.firstTeam.members = members;
          });
          await teamApi.getUserById(this.matchDetails.firstTeam.captainId).then((captain) => {
            this.matchDetails.firstTeam.captain = captain;
          });
        });
        teamApi.getTeamByID(this.matchDetails.secondTeamId).then(async (secondTeam) => {
          this.matchDetails.secondTeam = secondTeam;
          let secondTeamPromises = [];
          for (let i = 0; i < this.matchDetails.secondTeam.membersId.length; ++i) {
            secondTeamPromises.push(teamApi.getUserById(this.matchDetails.secondTeam.membersId[i]));
          }
          await Promise.all(secondTeamPromises).then((members) => {
            this.matchDetails.secondTeam.members = members;
          });
          await teamApi.getUserById(this.matchDetails.secondTeam.captainId).then((captain) => {
            this.matchDetails.secondTeam.captain = captain;
          });
        });
      })
      .then(async () => {
        await mapsApi.collectMaps(this.matchDetails.allMaps);
        let allMapsArray = utils.getUniqueItemsByFieldArrayFromProxyArray(this.matchDetails.allMaps, "id");
        const selectedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.maps);
        const bannedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.mapsBanned);
        allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, selectedMapsArray));
        allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, bannedMapsArray));
        this.matchDetails.allMaps = allMapsArray;
      });
  },

  created: function () {
    onSnapshot(doc(db, "matches", this.$route.params.id), async (doc) => {
      this.matchDetails.id = this.$route.params.id;
      this.matchDetails.firstTeamId = doc.data().first_team;
      this.matchDetails.secondTeamId = doc.data().second_team;
      this.matchDetails.winnerId = doc.data().winner;
      this.matchDetails.matchType = doc.data().match_type;
      this.matchDetails.maps = doc.data().maps;
      this.matchDetails.mapsBanned = doc.data().maps_banned;
      this.matchDetails.scores = doc.data().scores;
      this.matchDetails.firstTeamMapWins = doc.data().first_team_map_wins;
      this.matchDetails.secondTeamMapWins = doc.data().second_team_map_wins;
      this.matchDetails.currentMatchIndex = doc.data().current_match_index;
      this.matchDetails.nextMatchId = doc.data().next_match_id;

      await mapsApi.collectMaps(this.matchDetails.allMaps).then(() => {
        let allMapsArray = utils.getUniqueItemsByFieldArrayFromProxyArray(this.matchDetails.allMaps, "id");
        const selectedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.maps);
        const bannedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.mapsBanned);

        allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, selectedMapsArray));
        allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, bannedMapsArray));
        this.matchDetails.allMaps = allMapsArray;
      });
    });
  },
};
</script>

<style scoped>
.no-wrap {
  overflow: hidden;
  white-space: nowrap;
}

.smaller {
  font-size: 12px;
}
</style>
