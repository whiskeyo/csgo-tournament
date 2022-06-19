<template>
  <div id="details-team-cycle"></div>
</template>

<script>
import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import { main } from "../services/detailsTeamCycle.js";

export default {
  name: "TeamDetailsHandler",
  mounted: function () {
    run(main, {
      DOM: makeDOMDriver("#details-team-cycle"),
    });
  },
};
</script>
