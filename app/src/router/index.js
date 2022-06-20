import { createRouter, createWebHistory } from "vue-router";

import store from "../store";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import TournamentCreate from "../views/TournamentCreate.vue";
import TournamentList from "../views/TournamentList.vue";
import TournamentDetails from "../views/TournamentDetails.vue";
import Team from "../views/Team.vue";
import TeamCreateHandler from "../views/TeamCreateHandler.vue";
import TeamListHandler from "../views/TeamListHandler.vue";
import TeamDetailsHandler from "../views/TeamDetailsHandler.vue";
import TeamDetails from "../views/TeamDetails.vue";
import Maps from "../views/Maps.vue";
import Matches from "../views/Matches.vue";
import MatchRoom from "../views/MatchRoom.vue";

/**
 * Array storing routes used by Vue Router for redirections
 * @readonly
 * @array
 */
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/tournament/create",
    name: "Tournament",
    component: TournamentCreate,
  },
  {
    path: "/tournament/list",
    name: "List of Tournaments",
    component: TournamentList,
  },
  {
    path: "/tournament/:id",
    name: "Tournament Details",
    component: TournamentDetails,
  },
  {
    path: "/tournament/maps",
    name: "Maps",
    component: Maps,
  },
  {
    path: "/tournament/matches",
    name: "List of Matches",
    component: Matches,
  },
  {
    path: "/tournament/matches/:id",
    name: "Match Details",
    component: MatchRoom,
  },
  {
    path: "/team/create",
    name: "Create a Team",
    component: TeamCreateHandler,
  },
  {
    path: "/team",
    name: "Team",
    component: Team,
  },
  {
    path: "/team/details/:id",
    name: "Team Details (Cycle.js)",
    component: TeamDetailsHandler,
  },
  {
    path: "/team/:id",
    name: "Team Details",
    component: TeamDetails,
  },
  {
    path: "/team/list",
    name: "List of Teams",
    component: TeamListHandler,
  },
];

/**
 * Router object storing the history and routes
 * @readonly
 * @object
 */
export const router = createRouter({
  history: createWebHistory(),
  mode: "history",
  routes,
});

/**
 * @method
 * @param {RouteLocationNormalized} to   Route to be redirected to
 * @param {RouteLocationNormalized} from Route to be redirected from
 * @param {NavigationGuardNext} next     Action to happen next
 */
router.beforeEach((to, from, next) => {
  document.title = "[" + store.state.$appName + "] " + to.name;
  next();
});

export default router;
