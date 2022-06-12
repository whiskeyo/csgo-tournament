<template>
  <div>
    <h1>Match Room</h1>
    <div class="row">
      <h2>{{ this.matchDetails.firstTeam.name + " versus " + this.matchDetails.secondTeam.name }}</h2>
      <div class="col-4 text-center">
        <h3>{{ this.matchDetails.firstTeam.name }}</h3>
        <ul class="list-group text-start mb-2">
          <li class="list-group-item list-group-item-primary fw-bold">
            Captain: {{ this.matchDetails.firstTeam.captain.nickname }}
          </li>
        </ul>
        <ul class="list-group text-start">
          <li
            v-for="member in this.matchDetails.firstTeam.members"
            v-bind:key="member.uid"
            class="list-group-item list-group-item-dark"
          >
            {{ member.nickname }} <br />
            ({{ member.fullname }})
          </li>
        </ul>
      </div>
      <div class="col-4 text-center">
        <div v-if="allMaps.length">
          <h3>Maps</h3>
          <ul class="list-group">
            <li
              v-for="map in this.allMaps"
              v-bind:key="map.id"
              class="list-group-item list-group-item-dark"
              @click="changeMapState(map)"
            >
              {{ map.name }}
            </li>
          </ul>
        </div>
        <h3 v-if="matchDetails.maps.length">Selected Maps</h3>
        <ul class="list-group">
          <li
            v-for="map in this.matchDetails.maps"
            v-bind:key="map"
            class="list-group-item list-group-item-success fw-bold"
          >
            {{ map }}
          </li>
        </ul>
        <h3 v-if="matchDetails.mapsBanned.length">Banned Maps</h3>
        <ul class="list-group">
          <li
            v-for="map in this.matchDetails.mapsBanned"
            v-bind:key="map"
            class="list-group-item list-group-item-danger"
          >
            {{ map }}
          </li>
        </ul>
        <div v-if="phaseInfo != ''">
          {{ this.phaseInfo }}, turn of player:
          <div v-if="actionsTakenOnMaps % 2 == 0">
            {{ this.matchDetails.firstTeam.captain.nickname }}
          </div>
          <div v-else>
            {{ this.matchDetails.secondTeam.captain.nickname }}
          </div>
        </div>
      </div>
      <div class="col-4 text-center">
        <h3>{{ this.matchDetails.secondTeam.name }}</h3>
        <ul class="list-group text-end mb-2">
          <li class="list-group-item list-group-item-primary fw-bold">
            Captain: {{ this.matchDetails.secondTeam.captain.nickname }}
          </li>
        </ul>
        <ul class="list-group text-end">
          <li
            v-for="member in this.matchDetails.secondTeam.members"
            v-bind:key="member.uid"
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
import types from "../services/types";
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
          name: "temp a",
          captainId: "",
          membersId: [],
          captain: { nickname: "", fullname: "", email: "", uid: "" },
          members: [],
        },
        secondTeam: {
          name: "temp b",
          captainId: "",
          membersId: [],
          captain: { nickname: "", fullname: "", email: "", uid: "" },
          members: [],
        },
        winner: "",
      },
      allMaps: [],
      actionsTakenOnMaps: 0,
      phaseInfo: "Banning maps",
    };
  },

  watch: {
    matchDetails: {
      deep: true,
      handler: function () {
        this.actionsTakenOnMaps = this.matchDetails.maps.length + this.matchDetails.mapsBanned.length;
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
      /* add if checking parity of this.actionsTakenOnMaps and set a person to ban */
      // map;
      // types;
      if (this.actionsTakenOnMaps < 2) {
        this.phaseInfo = "Banning maps";
      } else if (this.actionsTakenOnMaps == 2) {
        this.phaseInfo = "Picking maps";
      } else {
        this.phaseInfo = "";
      }

      if (this.actionsTakenOnMaps % 2 == 0 && this.$store.state.$user.uid != this.matchDetails.firstTeam.captainId)
        return;

      if (this.actionsTakenOnMaps % 2 == 1 && this.$store.state.$user.uid != this.matchDetails.secondTeam.captainId)
        return;

      switch (this.matchDetails.matchType) {
        case types.MatchType.BO1: {
          if (this.actionsTakenOnMaps < 2) {
            utils.removeItemFromArray(map, this.allMaps);
            this.matchDetails.mapsBanned.push(map.name);
          } else {
            utils.removeItemFromArray(map, this.allMaps);
            this.matchDetails.maps.push(map.name);
          }
          break;
        }
      }
      matchApi
        .updateMatch(this.$route.params.id, {
          maps: this.matchDetails.maps,
          maps_banned: this.matchDetails.mapsBanned,
        })
        .then(() => console.log("match updated"));
    },
  },

  beforeCreate: async function () {
    onSnapshot(doc(db, "matches", this.$route.params.id), (doc) => {
      console.log("Current data: ", doc.data());
      this.matchDetails.id = this.$route.params.id;
      this.matchDetails.firstTeamId = doc.data().first_team;
      this.matchDetails.secondTeamId = doc.data().second_team;
      this.matchDetails.winnerId = doc.data().winner;
      this.matchDetails.matchType = doc.data().match_type;
      this.matchDetails.maps = doc.data().maps;
      this.matchDetails.mapsBanned = doc.data().maps_banned;
      this.matchDetails.scores = doc.data().scores;

      teamApi.getTeamByID(this.matchDetails.firstTeamId).then((firstTeam) => {
        this.matchDetails.firstTeam = firstTeam;
        let firstTeamPromises = [];
        for (let i = 0; i < this.matchDetails.firstTeam.membersId.length; ++i) {
          firstTeamPromises.push(teamApi.getUserById(this.matchDetails.firstTeam.membersId[i]));
        }
        Promise.all(firstTeamPromises).then((members) => {
          this.matchDetails.firstTeam.members = members;
        });

        teamApi.getUserById(this.matchDetails.firstTeam.captainId).then((captain) => {
          this.matchDetails.firstTeam.captain = captain;
        });
      });

      teamApi.getTeamByID(this.matchDetails.secondTeamId).then((secondTeam) => {
        this.matchDetails.secondTeam = secondTeam;
        let secondTeamPromises = [];
        for (let i = 0; i < this.matchDetails.secondTeam.membersId.length; ++i) {
          secondTeamPromises.push(teamApi.getUserById(this.matchDetails.secondTeam.membersId[i]));
        }
        Promise.all(secondTeamPromises).then((members) => {
          this.matchDetails.secondTeam.members = members;
        });

        teamApi.getUserById(this.matchDetails.secondTeam.captainId).then((captain) => {
          this.matchDetails.secondTeam.captain = captain;
        });
      });

      mapsApi.collectMaps(this.allMaps).then(() => {
        let allMapsArray = utils.getUniqueItemsByFieldArrayFromProxyArray(this.allMaps, "id");
        const selectedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.maps);
        const bannedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.mapsBanned);

        allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, selectedMapsArray));
        allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, bannedMapsArray));
        this.allMaps = allMapsArray;
      });
    });

    /* this whole block works well but does not support real time changes */
    // matchApi
    //   .getMatchByID(this.$route.params.id)
    //   .then((match) => {
    //     this.matchDetails.id = this.$route.params.id;
    //     this.matchDetails.firstTeamId = match.firstTeam;
    //     this.matchDetails.secondTeamId = match.secondTeam;
    //     this.matchDetails.winnerId = match.winner;
    //     this.matchDetails.matchType = match.matchType;
    //     this.matchDetails.maps = match.maps;
    //     this.matchDetails.mapsBanned = match.mapsBanned;
    //     this.matchDetails.scores = match.scores;
    //   })
    //   .then(async () => {
    //     teamApi.getTeamByID(this.matchDetails.firstTeamId).then((firstTeam) => {
    //       this.matchDetails.firstTeam = firstTeam;
    //       let firstTeamPromises = [];
    //       for (let i = 0; i < this.matchDetails.firstTeam.membersId.length; ++i) {
    //         firstTeamPromises.push(teamApi.getUserById(this.matchDetails.firstTeam.membersId[i]));
    //       }
    //       Promise.all(firstTeamPromises).then((members) => {
    //         this.matchDetails.firstTeam.members = members;
    //       });

    //       teamApi.getUserById(this.matchDetails.firstTeam.captainId).then((captain) => {
    //         this.matchDetails.firstTeam.captain = captain;
    //       });
    //     });

    //     teamApi.getTeamByID(this.matchDetails.secondTeamId).then((secondTeam) => {
    //       this.matchDetails.secondTeam = secondTeam;
    //       let secondTeamPromises = [];
    //       for (let i = 0; i < this.matchDetails.secondTeam.membersId.length; ++i) {
    //         secondTeamPromises.push(teamApi.getUserById(this.matchDetails.secondTeam.membersId[i]));
    //       }
    //       Promise.all(secondTeamPromises).then((members) => {
    //         this.matchDetails.secondTeam.members = members;
    //       });

    //       teamApi.getUserById(this.matchDetails.secondTeam.captainId).then((captain) => {
    //         this.matchDetails.secondTeam.captain = captain;
    //       });
    //     });
    //   })
    //   .then(async () => {
    //     await mapsApi.collectMaps(this.allMaps);
    //     let allMapsArray = utils.getUniqueItemsByFieldArrayFromProxyArray(this.allMaps, "id");
    //     const selectedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.maps);
    //     const bannedMapsArray = utils.getUniqueItemsArrayFromProxyArray(this.matchDetails.mapsBanned);

    //     allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, selectedMapsArray));
    //     allMapsArray = allMapsArray.filter((map) => !utils.isItemInArray(map.name, bannedMapsArray));
    //     this.allMaps = allMapsArray;
    //   });
  },
};
</script>
