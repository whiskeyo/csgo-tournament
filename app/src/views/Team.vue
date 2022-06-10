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
            <input class="form-control" placeholder="Your team name" v-model="createTeamForm.teamName" />
          </div>
          <div class="form-group">
            <label>Add players to your team</label>
            <select
              multiple
              v-model="createTeamForm.selectedUsers"
              size="15"
              class="form-select"
              aria-label="Default select example"
            >
              <option disabled>Select multiple players</option>
              <option v-for="user in allUsers" v-bind:key="user.uid" :value="user.uid">
                {{ user.nickname + " (" + user.email + ")" }}
              </option>
            </select>
          </div>
          <input type="submit" value="Create!" />
        </form>
      </div>
      <div class="col-3">
        <h2>Existing teams</h2>
        <ul>
          <li v-for="team in allTeams" v-bind:key="team.id">
            <router-link :to="'/team/' + team.id">
              {{ team.name }}
            </router-link>
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
import teamApi from "../api/teamApi";

export default {
  name: "Team",

  data: function () {
    return {
      allUsers: [],
      allTeams: [],
      userTeams: [],
      createTeamForm: {
        teamName: "",
        selectedUsers: [],
      },
    };
  },

  methods: {
    /* move collect functions' bodies to created */
    collectUsers: async function () {
      teamApi.collectUsers(this.allUsers);
    },
    collectTeams: async function () {
      teamApi.collectTeams(this.allTeams);
    },
    collectUserTeams: async function () {
      teamApi.collectUserTeams(this.userTeams, this.$store);
    },
    createTeam: async function (event) {
      teamApi.createTeam(this.createTeamForm, event, this.$store);
    },
  },

  created: function () {
    this.collectUsers();
    this.collectTeams();
    this.collectUserTeams();
  },
};
</script>
