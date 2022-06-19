import xs from "xstream";
import { div, h1, h2, h3, ul, li } from "@cycle/dom";
import teamApi from "../api/teamApi";
import tournamentApi from "../api/tournamentApi";
import router from "../router";

function renderTeamName(teamName) {
  return h2(teamName);
}

function renderCaptainInfo(captain) {
  return div([
    h3("Captain"),
    div(`${captain.nickname} (${captain.fullname})`),
    div(`Contact email: ${captain.email}`)
  ])
}

function renderTeamMembersList(members) {
  return div([
    h3("Members"),
    ul([
      ...members.map((member) => {
        return li(`${member.nickname} (${member.fullname})`)
      })
    ])
  ])
}

function renderTournamentsAttendedList(tournamentsAttended, teamName) {
  return div([
    h2("Tournaments attended"),
    ul(
      tournamentsAttended.map((tournament) => {
        return li(`${tournament.name + (tournament.winner == teamName ? " (1st place)" : "")}`)
      })
    )
  ])
}

function intent() {
  const teamDetails$ = xs.from(teamApi.getTeamDetailsByID(router.currentRoute.value.params.id));
  const tournamentsAttended$ = xs.from(tournamentApi.getTournamentsPlayedByTeam(router.currentRoute.value.params.id));

  return {
    teamDetails$: teamDetails$,
    tournamentsAttended$: tournamentsAttended$,
  };
}

function model(actions) {
  const teamDetails$ = actions.teamDetails$.startWith({
    id: "",
    name: "",
    captainId: "",
    captain: {nickname: "", fullname: "", email: "", uid: ""},
    membersId: [],
    members: [],
  });
  const tournamentsAttended$ = actions.tournamentsAttended$.startWith([]);

  return xs.combine(teamDetails$, tournamentsAttended$)
    .map(([teamDetails, tournamentsAttended]) => {
      return { teamDetails, tournamentsAttended };
  });
}

function view(state$) {
  return state$.map(({ teamDetails, tournamentsAttended }) =>
    div([
      h1("Team Details"),
      div(".row", [
        div(".col-6", [
          renderTeamName(teamDetails.name),
          renderCaptainInfo(teamDetails.captain),
          renderTeamMembersList(teamDetails.members),
        ]),
        div(".col-6", [
          renderTournamentsAttendedList(tournamentsAttended, teamDetails.name),
        ]),
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
