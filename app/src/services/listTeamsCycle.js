import xs from "xstream";
import { a, div, h1, table, thead, tr, th, tbody, td } from "@cycle/dom";
import teamApi from "../api/teamApi";

function renderTeamsTable(teamsList, playersList) {
  return table(".table table-dark table-striped text-start align-middle", [
    thead([
      tr([
        th("Team"),
        th("Captain"),
      ])
    ]),
    tbody([
      ...teamsList.map((team) => {
        let captainNickname = "";
        let captainEmail = "";
        for (const player of playersList) {
          if (team.captain == player.uid) {
            captainNickname = player.nickname;
            captainEmail = player.email;
            break;
          }
        }

        return tr([
          td(
            a({attrs: { href: "/team/" + team.id }}, `${team.name}`)
          ),
          td(`${captainNickname} (${captainEmail})`),
        ])
      })
    ])
  ])
}

function intent() {
  const teamsList$ = xs.from(teamApi.getTeams());
  const playersList$ = xs.from(teamApi.getUsers());

  return {
    teamsList$: teamsList$,
    playersList$: playersList$,
  };
}

function model(actions) {
  const teamsList$ = actions.teamsList$.startWith([]);
  const playersList$ = actions.playersList$.startWith([]);

  return xs.combine(teamsList$, playersList$)
    .map(([teamsList, playersList]) => {
      return { teamsList, playersList };
  });
}

function view(state$) {
  return state$.map(({ teamsList, playersList }) =>
    div([
      div(".row", [
        // div(".col-2", []),
        div(".col-12", [
          h1("List of Teams"),
          renderTeamsTable(teamsList, playersList),
        ]),
        // div(".col-2", []),
      ]),
    ])
  );
}

export function main(sources) {
  const actions = intent(sources.DOM);
  const state$ = model(actions);
  const vdom$ = view(state$);
  // equal to vdom$ = view(model(intent(sources.DOM)))
  return {
    DOM: vdom$,
  };
}
