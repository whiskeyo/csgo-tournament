import { div, label, input, hr, h1 } from "@cycle/dom";

function cycleJsTest(sources) {
  const vdom$ = sources.DOM.select(".myinput")
    .events("input")
    .map((ev) => ev.target.value)
    .startWith("")
    .map((name) =>
      div([label("Name:"),
           input(".myinput", { attrs: { type: "text" } }),
           hr(),
           h1(`Hello ${name}`)]));
  return {
    DOM: vdom$,
  };
}

export default cycleJsTest;
