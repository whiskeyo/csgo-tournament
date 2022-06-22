<template>
  <div id="create-team-cycle"></div>
</template>

<script>
import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import { main } from "../services/createTeamCycle.js";

/**
 * @vue-event {void} mounted - Mounts the Cycle.js createTeam component
 */
export default {
  name: "TeamCreateHandler",
  mounted: function () {
    run(main, {
      DOM: makeDOMDriver("#create-team-cycle"),
    });
  },
};
</script>
