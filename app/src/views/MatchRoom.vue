<template>
  <div>
    <h1>Match Room</h1>
    <div class="row">
      <h2>
        {{ this.matchDetails?.firstTeam?.name + " versus " + this.matchDetails?.secondTeam?.name }}
      </h2>
      <div class="col-4 text-center">
        <h3>{{ this.matchDetails.firstTeam.name }}</h3>
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
              class="list-group-item list-group-item-dark"
              @click="changeMapState(map)"
            >
              {{ map.name }}
            </li>
          </ul>
        </div>
        <h3 v-if="matchDetails.maps.length">Selected Maps</h3>
        <ul class="list-group">
          <li v-for="map in matchDetails.maps" :key="map" class="list-group-item list-group-item-success fw-bold">
            {{ map }}
          </li>
        </ul>
        <h3 v-if="matchDetails.mapsBanned.length">Banned Maps</h3>
        <ul class="list-group">
          <li v-for="map in matchDetails.mapsBanned" :key="map" class="list-group-item list-group-item-danger">
            {{ map }}
          </li>
        </ul>
        <div v-if="matchDetails.phaseInfo != ''">
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
// import types from "../services/types";
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
    // unsubscribe: function () {
    //   onSnapshot(doc(db, "matches", this.matchDetails.id), (doc) => {
    //     console.log("match update!!!!", doc.data());
    //   });
    // },

    changeMapState: function (map) {
      /* add if checking parity of this.matchDetails.actionsTakenOnMaps and set a person to ban */
      // map;
      // types;
      if (
        this.matchDetails.actionsTakenOnMaps % 2 == 0 &&
        this.$store.state.$user.uid != this.matchDetails.firstTeam.captainId
      )
        return;

      if (
        this.matchDetails.actionsTakenOnMaps % 2 == 1 &&
        this.$store.state.$user.uid != this.matchDetails.secondTeam.captainId
      )
        return;

      utils.setMapState(map, this.matchDetails);

      matchApi
        .updateMatch(this.$route.params.id, {
          maps: this.matchDetails.maps,
          maps_banned: this.matchDetails.mapsBanned,
        })
        .then(() => console.log("match updated"));
    },
  },

  beforeCreate: async function () {
    await matchApi
      .getMatchByID(this.$route.params.id)
      .then((match) => {
        console.log("fetching match details");
        this.matchDetails.id = this.$route.params.id;
        this.matchDetails.firstTeamId = match.firstTeam;
        this.matchDetails.secondTeamId = match.secondTeam;
        this.matchDetails.winnerId = match.winner;
        this.matchDetails.matchType = match.matchType;
        this.matchDetails.maps = match.maps;
        this.matchDetails.mapsBanned = match.mapsBanned;
        this.matchDetails.scores = match.scores;
        console.log("fetching match details finished");
      })
      .then(async () => {
        console.log("fetching first team details");
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
        console.log("fetching first team details finished, starting fetching second team details");
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
        console.log("fetching maps finished");
      });
    console.log("beforeCreate finished");
  },

  created: function () {
    console.log("created started");
    onSnapshot(doc(db, "matches", this.$route.params.id), async (doc) => {
      console.log("Current data: ", doc.data());
      this.matchDetails.id = this.$route.params.id;
      this.matchDetails.firstTeamId = doc.data().first_team;
      this.matchDetails.secondTeamId = doc.data().second_team;
      this.matchDetails.winnerId = doc.data().winner;
      this.matchDetails.matchType = doc.data().match_type;
      this.matchDetails.maps = doc.data().maps;
      this.matchDetails.mapsBanned = doc.data().maps_banned;
      this.matchDetails.scores = doc.data().scores;

      await mapsApi.collectMaps(this.matchDetails.allMaps).then(() => {
        console.log("filtering maps started");
        let allMapsArray = utils.getUniqueItemsByFieldArrayFromProxyArray(this.matchDetails.allMaps, "id");
        const selectedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.maps);
        const bannedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.mapsBanned);

        allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, selectedMapsArray));
        allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, bannedMapsArray));
        this.matchDetails.allMaps = allMapsArray;
        console.log("filtering maps finished");
      });
      console.log("created finished");
    });
  },
};
</script>
