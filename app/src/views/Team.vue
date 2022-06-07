<template>
  <div>
    <h1>Team</h1>
    <button @click="collectTeams">Manually collect all Teams from db</button>
    <button @click="collectUserTeams">Manually collect user Teams from db</button>
    <div class="row">
      <div class="col-6">
        <h2>Create a Team</h2>
        <form @submit="createTeam">
          <div class="form-group">
            <label>Name of the team</label>
            <input class="form-control" placeholder="Your team name" v-model="createTeamForm.teamName">
          </div>
          <div class="form-group">
            <label>Add players to your team</label>
            <select
              multiple
              v-model="createTeamForm.selectedUsers"
              size="15"
              class="form-select"
              aria-label="Default select example">
              <option disabled>Select multiple players</option>
              <option v-for="user in allUsers" v-bind:key="user.uid" :value="user.uid">
                {{ user.nickname + " (" + user.email + ")" }}
              </option>
            </select>
          </div>
          <input type="submit" value="Create!">
        </form>
      </div>
      <div class="col-3">
        <h2>Existing teams</h2>
        <ul>
          <li v-for="team in allTeams" v-bind:key="team.name">
            {{ team.name }}
          </li>
        </ul>
      </div>
      <div class="col-3">
        <h2>Your teams</h2>
        <ul>
          <li v-for="team in userTeams" v-bind:key="team.name">
            {{ team.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../configs/db';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import store from "../store";

export default {
  name: "Team",

  data: function () {
    return {
      allUsers: [],
      allTeams: [],
      userTeams: [],
      createTeamForm: {
        teamName: "",
        selectedUsers: []
      }
    };
  },

  methods: {
    collectUsers: async function() {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        this.allUsers.push({
          nickname: data.nickname,
          fullname: data.fullname,
          email: data.email,
          uid: data.uid
        });
      })
    },
    collectTeams: async function() {
      this.allTeams = [];
      const querySnapshot = await getDocs(collection(db, "teams"));
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        this.allTeams.push({
          name: data.name,
          members: data.members,
          captain: data.captain
        });
      })
    },
    collectUserTeams: async function() {
      this.userTeams = [];
      const teams = query(collection(db, "teams"), where("captain", "==", store.state.$user?.uid));
      const teamsSnapshot = await getDocs(teams);
      teamsSnapshot.forEach((doc) => {
        this.userTeams.push({
          name: doc.data().name
        });
      });
    },
    createTeam: async function (event) {
      event.preventDefault();
      try {
        console.log("this.$store.state.$user: ", this.$store.state.$user);
        const docRef = await addDoc(collection(db, "teams"), {
          name: this.createTeamForm.teamName,
          captain: this.$store.state.$user.uid,
          members: this.createTeamForm.selectedUsers
        });
        console.log("Team ", this.createTeamForm.teamName, " added with ID ", docRef.id);
      } catch (err) {
        console.log("Error while adding a team: ", err);
      }
    }
  },

  created: function () {
    this.collectUsers();
    // this.collectTeams();
    // this.collectUserTeams();
  },
};
</script>
