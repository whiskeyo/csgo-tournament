// import { div, p/*, label, input, select, optgroup, hr, h1*/ } from "@cycle/dom";
import xs from 'xstream';
import { div, h1, p, button, label, input, select, option } from "@cycle/dom";
import teamApi from "../api/teamApi";
import store from '../store';
// import store from '../store';

function renderTeamNameInput(teamName) {
  return div(".form-group", [
    label("Name of the team"),
    input(".team-name form-control", { attrs: { type: "text", value: teamName } }),
    // p("Name of the team is " + teamName)
  ])
}

function renderTeamPlayersSelect(players, selectedPlayers) {
  console.log("[renderTeamPlayersSelect] players: ", players);
  console.log("[renderTeamPlayersSelect] selectedPlayers: ", selectedPlayers);
  return div(".form-group", [
    label("Add players to your team"),
    select(".team-players form-select", { attrs: { multiple: "multiple", size: 15}},
    [
      option({ attrs: { disabled: true }}, "Select multiple players"),
      ...players.map((player) => option({ attrs: { value: player.uid } }, `${player.nickname}`, ))
    ]),
    p("Selected players: " + selectedPlayers.join(", "))
  ]);
}

function renderCreateTeamButton(createTeam, teamName, selectedPlayers) {
  console.log("[renderCreateTeamButton] store.state.$user.uid: ", store.state.$user.uid);
  return button(
    ".team-create-button btn btn-light",
    { attrs: { type: "button", onclick: createTeam ? teamApi.createTeam({teamName: teamName, selectedUsers: selectedPlayers}, store) : null } },
    "Create a Team");
}

function intent(domSource) {
  const changeTeamName$ = domSource.select(".team-name").events("input").map(ev => ev.target.value);
  const changeSelectedTeamPlayers$ = domSource.select(".team-players").events("input").map(ev => {
    // console.log("[intent] changeSelectedTeamPlayers$ *ev.target.selectedOptions*: ", ev.target.selectedOptions);
    let selectedPlayers = [];
    for (let i = 0; i < ev.target.selectedOptions.length; ++i) {
      // console.log("Selected with index " + i + " is " + ev.target.selectedOptions[i].label);
      selectedPlayers.push(ev.target.selectedOptions[i].value)
    }
    return selectedPlayers;
  });
  const createTeamButton$ = domSource.select(".team-create-button").events("click").map(() => true);

  return {
    changeTeamName$: changeTeamName$,
    changeSelectedTeamPlayers$: changeSelectedTeamPlayers$,
    createTeamButton$: createTeamButton$,
  };
}

function model(actions) {
  let players = [];
  teamApi.getUsers().then((fetchedPlayers) => {
    players = fetchedPlayers;
    // console.log("[model] players: ", players);
  });

  const teamName$ = actions.changeTeamName$.startWith("");
  const selectedPlayers$ = actions.changeSelectedTeamPlayers$.startWith([]);
  const createTeam$ = actions.createTeamButton$.startWith(false);
  // console.log("[model] teamName$: ", teamName$);
  // console.log("[model] selectedPlayers$: ", selectedPlayers$);

  return xs.combine(teamName$, selectedPlayers$, createTeam$)
    .map(([teamName, selectedPlayers, createTeam]) => {
      // console.log("[model] mapped teamName: ", teamName);
      // console.log("[model] mapped selectedPlayers: ", selectedPlayers);
      // console.log("[model] mapped players: ", players);
      // console.log("[model] mapped createTeam: ", createTeam);
      return {teamName, selectedPlayers, players, createTeam};
    });
}

function view(state$) {
  return state$.map(({teamName, selectedPlayers, players, createTeam}) =>
    div([
      div(".row", [
        div(".col-2", []),
        div(".col-8", [
          h1("Create a Team"),
          renderTeamNameInput(teamName),
          renderTeamPlayersSelect(players, selectedPlayers),
          renderCreateTeamButton(createTeam, teamName, selectedPlayers)
        ]),
        div(".col-2", []),
      ])]));
}

export function main(sources) {
  const actions = intent(sources.DOM);
  const state$ = model(actions);
  const vdom$ = view(state$);
  // equal to vdom$ = view(model(intent(sources.DOM)))
  return {
    DOM: vdom$
  };
}

// function createTeamCycle(sources) {
//   let allPlayers$ = [];
//   teamApi.collectUsers(allPlayers$);
//   console.log("all players: ", allPlayers$);

//   // const action$ = xs.merge(
//   //   sources.DOM.select('.create-team').events('click').map((ev) => {
//   //     teamApi.createTeam({teamName: "nowy z cycle js", selectedUsers: ["aaa", "bbb", "ccc"]}, store);
//   //     return ev - 1;
//   //   }),
//   //   sources.DOM.select('.increment').events('click').map(ev => ev + 1)
//   // );

//   const action$ = sources.DOM
//     // .select('.team-name').events('input').map(ev => ev.target.value)
    // .select(".create-team")
    // .events("click")
    // .map(async (name /*, selectedUsers*/) => {
    //   const teamRef = await teamApi.createTeam({ teamName: name, selectedUsers: ["aaa", "bbb", "ccc"] }, store);
    //   router.push("/team/" + teamRef.id);
    // });

//   const count$ = action$.fold((acc, x) => acc + x, 0);
//   const vdom$ = count$.map((count) =>
//     div(".row", [
//       div(".col-2", []),
//       div(".col-8", [
//         div(".form-group", [label("Name:"), input(".team-name form-control", { attrs: { type: "text" } })]),
//         button(".create-team", "Create a Team"),
//         button(".increment", "Increment"),
//         p("Counter: " + count),
//       ]),
//       div(".col-2", []),
//     ])
//   );

//   return {
//     DOM: vdom$,
//   };
// }

// export default createTeamCycle;
