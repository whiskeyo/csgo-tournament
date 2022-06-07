<template>
  <h1>Cycle.js Test</h1>
  <div id="cyclejstest"></div>
</template>

<script>
// import runner from './CycleTest'
import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import cycleJsTest from "../services/cycleTest.js";

export default {
  name: "CycleJsTest",
  mounted: function () {
    run(cycleJsTest, {
      DOM: makeDOMDriver("#cyclejstest"),
    });
  },
};
</script>
