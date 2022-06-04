<template>
  <div>
    <h1>Tournament</h1>
    <button @click="collectUsers">sdsdds</button>
    <!-- <div class="row">
      <div class="col-6">
        <h2>Available maps</h2>
        <ul>
          <li v-for="map in maps" v-bind:key="map.id">
            {{ map.name }}
          </li>
        </ul>
      </div>
      <div class="col-3">
        <h2>Available maps</h2>
        <ul>
          <li v-for="map in maps" v-bind:key="map.id">
            {{ map.name }}
          </li>
        </ul>
      </div>
      <div class="col-3">
        <h2>Available maps</h2>
        <ul>
          <li v-for="map in maps" v-bind:key="map.id">
            {{ map.name }}
          </li>
        </ul>
      </div>
    </div> -->
  </div>
</template>

<script>
// import axios from "axios";
import { db } from '../configs/db';
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "Tournament",

  data: function () {
    return {
      maps: [],
    };
  },

  methods: {
    collectUsers: async function() {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      })
    }
    // fetchMaps: async function () {
    //   await axios
    //     .get("http://127.0.0.1:8000/api/v1/maps/")
    //     // .then((response) => console.log(response.data))
    //     .then((response) => {
    //       for (let item in response.data) {
    //         this.maps.push({
    //           id: response.data[item].id,
    //           name: response.data[item].name,
    //           thumbnail: response.data[item].get_thumbnail,
    //           matches_played: response.data[item].matches_played,
    //           rounds_won_by_t: response.data[item].rounds_won_by_t,
    //           rounds_won_by_ct: response.data[item].rounds_won_by_ct,
    //         });
    //       }
    //     });
    // },
  },

  created: function () {
    // this.fetchMaps();
  },
};
</script>
