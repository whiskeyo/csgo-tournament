/** @namespace teamApi */

import { db } from "../configs/db";
import { doc, addDoc, getDocs, query, where, collection, getDoc } from "firebase/firestore";
import router from "../router";

const teamApi = {};

/**
 * @method
 * @param {Array} allUsers Array in which all users from DB are saved
 */
teamApi.collectUsers = async function (allUsers) {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allUsers.push({
      nickname: data.nickname,
      fullname: data.fullname,
      email: data.email,
      uid: data.uid,
    });
  });
};

/**
 * @method
 * @returns {Array} Array in which all users from DB are saved
 */
teamApi.getUsers = async function () {
  let allUsers = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allUsers.push({
      nickname: data.nickname,
      fullname: data.fullname,
      email: data.email,
      uid: data.uid,
    });
  });
  return allUsers;
};

/**
 * @method
 * @param {string} userId     ID of the user to be looked for in DB
 * @param {Object} userObject Object contating user data
 */
teamApi.collectUserByIdAndSetObject = async function (userId, userObject) {
  const user = query(collection(db, "users"), where("uid", "==", userId));
  const userSnapshot = await getDocs(user);
  const userData = userSnapshot.docs[0].data();
  userObject.nickname = userData.nickname;
  userObject.fullname = userData.fullname;
  userObject.email = userData.email;
  userObject.uid = userData.uid;
};

/**
 * @method
 * @param {string} userId ID of the user to be looked for in DB
 * @returns {Object}      Object contating user data
 */
teamApi.getUserById = async function(userId) {
  const user = query(collection(db, "users"), where("uid", "==", userId));
  const userSnapshot = await getDocs(user);
  const userData = userSnapshot.docs[0].data();
  return {
    nickname: userData.nickname,
    fullname: userData.fullname,
    email: userData.email,
    uid: userData.uid,
  };
}

/**
 * @method
 * @param {string} userId ID of the user to be looked for in DB
 * @param {Array} members Array of members that the user with given userID will be added
 */
teamApi.collectUserByIdAndAddToList = async function (userId, members) {
  const user = query(collection(db, "users"), where("uid", "==", userId));
  const userSnapshot = await getDocs(user);
  const userData = userSnapshot.docs[0].data();
  members.push({
    nickname: userData.nickname,
    fullname: userData.fullname,
    email: userData.email,
    uid: userData.uid,
  });
};

/**
 * @method
 * @param {Array} allUsers Array in which all teams from DB are saved
 */
teamApi.collectTeams = async function (allTeams) {
  allTeams.length = 0;
  const querySnapshot = await getDocs(collection(db, "teams"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allTeams.push({
      id: doc.id,
      name: data.name,
      members: data.members,
      captain: data.captain,
    });
  });
};


/**
 * @method
 * @returns {Array} Array in which all teams from DB are saved
 */
teamApi.getTeams = async function () {
  let allTeams = [];
  const querySnapshot = await getDocs(collection(db, "teams"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allTeams.push({
      id: doc.id,
      name: data.name,
      members: data.members,
      captain: data.captain,
    });
  });
  return allTeams;
};

/**
 * @method
 * @param {string} teamId      ID of the team to have collected its data
 * @param {Object} teamDetails Object with the team data stored in DB
 */
teamApi.collectTeamByID = async function (teamId, teamDetails) {
  const teamRef = doc(db, "teams", teamId);
  const teamDoc = await getDoc(teamRef);
  if (teamDoc.exists()) {
    teamDetails.id = teamDoc.id;
    teamDetails.name = teamDoc.data().name;
    teamDetails.captainId = teamDoc.data().captain;
    teamDetails.membersId = teamDoc.data().members;
  } else {
    console.log("Document " + teamId + " does not exist");
  }
};

/**
 * @method
 * @param {string} teamId ID of the team to have collected its data
 * @returns {Object}      Object with the team data stored in DB
 */
teamApi.getTeamByID = async function (teamId) {
  const teamRef = doc(db, "teams", teamId);
  const teamDoc = await getDoc(teamRef);
  if (teamDoc.exists()) {
    return {
      id: teamDoc.id,
      name: teamDoc.data().name,
      captainId: teamDoc.data().captain,
      membersId: teamDoc.data().members,
    }
  } else {
    console.log("Document " + teamId + " does not exist");
    return {}
  }
};

/**
 * @method
 * @param {string} teamId ID of the team to have collected its data
 * @returns {Object}      Object with the team data stored in DB extended by fields
 *                        with all members and captain data
 */
teamApi.getTeamDetailsByID = async function (teamId) {
  const teamRef = doc(db, "teams", teamId);
  const teamDoc = await getDoc(teamRef);
  if (teamDoc.exists()) {
    let captain = await this.getUserById(teamDoc.data().captain);
    let members = [];
    let membersPromises = [];
    for (const memberId of teamDoc.data().members) {
      members.push(await this.getUserById(memberId));
    }
    Promise.all(membersPromises).then((fetchedMembers) => members = fetchedMembers);

    return {
      id: teamDoc.id,
      name: teamDoc.data().name,
      captainId: teamDoc.data().captain,
      captain: captain,
      membersId: teamDoc.data().members,
      members: members,
    };
  } else {
    console.log("Document " + teamId + " does not exist");
    return {}
  }
}

/**
 * @method
 * @param {Array} userTeams Array in which all teams of the users will be stored
 * @param {Object} store    Vuex store object
 */
teamApi.collectUserTeams = async function (userTeams, store) {
  userTeams.length = 0;
  const teams = query(collection(db, "teams"), where("captain", "==", store.state.$user?.uid));
  const teamsSnapshot = await getDocs(teams);
  teamsSnapshot.forEach((doc) => {
    userTeams.push({
      name: doc.data().name,
    });
  });
};

/**
 * @method
 * @param {Object} createTeamForm Object with data required to create a team
 * @param {Object} store          Vuex store object
 */
teamApi.createTeam = async function (createTeamForm, store) {
  try {
    await addDoc(collection(db, "teams"), {
      name: createTeamForm.teamName,
      captain: store.state.$user.uid,
      members: createTeamForm.selectedUsers,
    }).then((docRef) => {
      router.push("/team/" + docRef.id);
    });
  } catch (err) {
    console.log("Error while adding a team: ", err);
  }
};

export default teamApi;
