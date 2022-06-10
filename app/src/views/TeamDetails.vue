<template>
  <div>
    <h1>Team Details</h1>
    <div class="row">
      <div class="col-6">
        <h2>{{ this.teamDetails.name }}</h2>
        <div>
          <h3>Captain</h3>
          {{ this.teamDetails.captain.nickname }} ({{ this.teamDetails.captain.fullname }})<br />
          Contact email: {{ this.teamDetails.captain.email }}
        </div>
        <div>
          <h3>Members</h3>
          <ul>
            <li v-for="member in this.teamDetails.members" v-bind:key="member.uid">
              {{ member.nickname }} ({{ member.fullname }})
            </li>
          </ul>
        </div>
      </div>
      <div class="col-6">
        <h2>Tournaments attended</h2>
        <ul>
          <li v-for="tournament in this.teamDetails.tournamentsPlayed" v-bind:key="tournament.id">
            {{ tournament.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import teamApi from "../api/teamApi";
import tournamentApi from "../api/tournamentApi";

export default {
  name: "Team Details",

  data: function () {
    return {
      teamDetails: {
        id: "",
        name: "",
        captainId: "",
        captain: {},
        membersId: [],
        members: [],
        tournamentsPlayed: [],
      },
    };
  },

  methods: {},

  created: async function () {
    teamApi.collectTeamByID(this.$route.params.id, this.teamDetails).then(() => {
      for (const memberId of this.teamDetails.membersId) {
        console.log("memberId: ", memberId);
        teamApi.collectUserByIdAndAddToList(memberId, this.teamDetails.members);
      }
      teamApi.collectUserByIdAndSetObject(this.teamDetails.captainId, this.teamDetails.captain);
      tournamentApi.collectTournamentsPlayedByTeam(this.teamDetails.id, this.teamDetails.tournamentsPlayed);
    });
  },
};
</script>
