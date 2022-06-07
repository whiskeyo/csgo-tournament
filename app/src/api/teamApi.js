import { db } from "../configs/db";
import { addDoc, getDocs, query, where, collection } from "firebase/firestore";

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

teamApi.collectTeams = async function (allTeams) {
  allTeams.length = 0;
  const querySnapshot = await getDocs(collection(db, "teams"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allTeams.push({
      name: data.name,
      members: data.members,
      captain: data.captain,
    });
  });
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
    console.log("store.state.$user: ", store.state.$user);
    const docRef = await addDoc(collection(db, "teams"), {
      name: createTeamForm.teamName,
      captain: store.state.$user.uid,
      members: createTeamForm.selectedUsers,
    });
    console.log("Team ", createTeamForm.teamName, " added with ID ", docRef.id);
  } catch (err) {
    console.log("Error while adding a team: ", err);
  }
};

export default teamApi;
