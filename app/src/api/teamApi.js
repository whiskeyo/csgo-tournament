import { db } from "../configs/db";
import { doc, addDoc, getDocs, query, where, collection, getDoc } from "firebase/firestore";

const teamApi = {};

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

teamApi.collectUserByIdAndSetObject = async function (userId, userObject) {
  const user = query(collection(db, "users"), where("uid", "==", userId));
  const userSnapshot = await getDocs(user);
  const userData = userSnapshot.docs[0].data();
  userObject.nickname = userData.nickname;
  userObject.fullname = userData.fullname;
  userObject.email = userData.email;
  userObject.uid = userData.uid;
};

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

teamApi.createTeam = async function (createTeamForm, event, store) {
  event.preventDefault();
  try {
    await addDoc(collection(db, "teams"), {
      name: createTeamForm.teamName,
      captain: store.state.$user.uid,
      members: createTeamForm.selectedUsers,
    });
  } catch (err) {
    console.log("Error while adding a team: ", err);
  }
};

export default teamApi;
