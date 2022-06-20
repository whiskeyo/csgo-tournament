import xs from "xstream";
import { div, h1, button, label, input, select, option } from "@cycle/dom";
import teamApi from "../api/teamApi";
import store from "../store";

function renderTeamNameInput(teamName) {
  return div(".form-group", [
    label("Name of the team"),
    input(".team-name form-control mb-2", { attrs: { type: "text", value: teamName } }),
  ]);
}

function renderTeamPlayersSelect(players) {
  return div(".form-group", [
    label("Add players to your team"),
    select(".team-players form-select", { attrs: { multiple: "multiple", size: 15 } }, [
      option({ attrs: { disabled: true } }, "Select multiple players"),
      ...players.map((player) => option({ attrs: { value: player.uid } }, `${player.nickname} (${player.email})`)),
    ]),
  ]);
}

function renderCreateTeamButton(createTeam, teamName, selectedPlayers) {
  return button(
    ".team-create-button btn btn-light",
    {
      attrs: {
        type: "button",
        onclick: createTeam ? teamApi.createTeam({ teamName: teamName, selectedUsers: selectedPlayers }, store) : null,
      },
    },
    "Create a Team"
  );
}

function intent(domSource) {
  const changeTeamName$ = domSource
    .select(".team-name")
    .events("input")
    .map((ev) => ev.target.value);
  const changeSelectedPlayers$ = domSource
    .select(".team-players")
    .events("input")
    .map((ev) => {
      let selectedPlayers = [];
      for (let i = 0; i < ev.target.selectedOptions.length; ++i) {
        selectedPlayers.push(ev.target.selectedOptions[i].value);
      }
      return selectedPlayers;
    });
  const createTeamButton$ = domSource
    .select(".team-create-button")
    .events("click")
    .map(() => true);
  const playersList$ = xs.from(teamApi.getUsers());

  return {
    changeTeamName$: changeTeamName$,
    changeSelectedPlayers$: changeSelectedPlayers$,
    createTeamButton$: createTeamButton$,
    playersList$: playersList$,
  };
}

function model(actions) {
  const changeTeamName$ = actions.changeTeamName$.startWith("");
  const selectedPlayers$ = actions.changeSelectedPlayers$.startWith([]);
  const createTeam$ = actions.createTeamButton$.startWith(false);
  const playersList$ = actions.playersList$.startWith([]);

  return xs
    .combine(changeTeamName$, selectedPlayers$, createTeam$, playersList$)
    .map(([changeTeamName, selectedPlayers, createTeam, playersList]) => {
      return { changeTeamName, selectedPlayers, playersList, createTeam };
    });
}

function view(state$) {
  return state$.map(({ changeTeamName, selectedPlayers, playersList, createTeam }) =>
    div([
      div(".row", [
        div(".col-2", []),
        div(".col-8", [h1("Create a Team"), renderTeamNameInput(changeTeamName), renderTeamPlayersSelect(playersList)]),
        div(".col-2", []),
      ]),
      div(".col-12 text-center align-middle mt-3", [renderCreateTeamButton(createTeam, changeTeamName, selectedPlayers)]),
    ])
  );
}

export function main(sources) {
  const actions = intent(sources.DOM);
  const state$ = model(actions);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
  };
}
