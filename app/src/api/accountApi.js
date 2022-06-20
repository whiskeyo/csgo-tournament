/** @namespace accountApi */

import { app } from "../configs/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../configs/db";
import { addDoc, getDocs, query, where, collection } from "firebase/firestore";

const accountApi = {};

/**
 * @method
 * @param {Object} auth Auth object returned from getAuth(app)
 * @returns User details from users collection
 */
async function getUserFromDbOnSignIn(auth) {
  const user = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
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
 * @param {string} uid User id from Firestore Authentication
 * @returns            Boolean saying whether there is a user with a given uid field
 *                     set in the DB
 */
async function isUserInDb(uid) {
  const users = query(collection(db, "users"), where("uid", "==", uid));
  const usersSnapshot = await getDocs(users);

  return !usersSnapshot.empty;
}

/**
 * @method
 * @param {string} uid      User id to be checked if there is such user in DB
 * @param {string} nickname Nickname of the user
 * @param {string} fullname Full name of the user
 * @param {string} email    Email address of the user
 */
async function createUserInDb(uid, nickname, fullname, email) {
  if (await isUserInDb(uid)) return;

  try {
    await addDoc(collection(db, "users"), {
      uid: uid,
      nickname: nickname,
      fullname: fullname,
      email: email,
    });
  } catch (err) {
    console.log("Error while adding a user: ", err);
  }
}

/**
 * Function allowing the sign-up with given parameters
 * @method
 * @param {string} email    Email of the new user
 * @param {string} password Password of the new user
 * @param {string} nickname Nickname of the new user
 * @param {string} fullname Full name of the new user
 * @returns {Boolean}       Boolean saying if the sing-up was successful
 */
accountApi.signUpWithEmailAndPassword = function (email, password, nickname, fullname) {
  const auth = getAuth(app);
  createUserWithEmailAndPassword(auth, email, password)
    .then(async () => {
      await createUserInDb(auth.currentUser.uid, nickname, fullname, email);
      return true;
    })
    .catch((error) => {
      console.log("Error while signing up: ", error.code, error.message);
      return false;
    });
};

/**
 * Function allowing the sign-in
 * @method
 * @param {string} email    Email of the user for a sign-in
 * @param {string} password Password of the user for a sign-in
 * @param {Object} store    Vuex store instance
 * @returns {Boolean}       Boolean saying if the sing-in was successful
 */
accountApi.signInWithEmail = function (email, password, store) {
  const auth = getAuth(app);

  signInWithEmailAndPassword(auth, email, password)
    .then(async () => {
      store.commit("setLoggedIn", { user: await getUserFromDbOnSignIn(auth) });
      return true;
    })
    .catch((error) => {
      console.log(error.code, error.message);
      return false;
    });
};

/**
 * Function allowing the sign-in with a Google account
 * @method
 * @param {Object} store    Vuex store instance
 */
accountApi.signInWithGoogle = function (store) {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(async () => {
      const user = auth.currentUser;
      await createUserInDb(user.uid, user.email.split("@")[0], user.displayName, user.email);
    })
    .then(async () => {
      store.commit("setLoggedIn", { user: await getUserFromDbOnSignIn(auth) });
    });
};

/**
 * Function for signing out
 * @method
 * @param {Object} store Vuex store instance
 */
accountApi.signOut = async function (store) {
  store.commit("setLoggedOff");
  const auth = getAuth(app);
  await signOut(auth);
};

export default accountApi;
