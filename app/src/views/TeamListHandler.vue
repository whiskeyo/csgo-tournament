<template>
  <div id="list-teams-cycle"></div>
</template>

<script>
import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import { main } from "../services/listTeamsCycle.js";

/**
 * @vue-event {void} mounted - Mounts the Cycle.js listTeams component
 */
export default {
  name: "TeamListHandler",
  mounted: function () {
    run(main, {
      DOM: makeDOMDriver("#list-teams-cycle"),
    });
  },
};
</script>
