import { app } from "../configs/firebase";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import { db } from '../configs/db';
import { addDoc, getDocs, query, where, collection } from "firebase/firestore";

const accountApi = {};

async function getUserFromDbOnSignIn(auth) {
    console.log("getUserFromDbOnSignIn", auth.currentUser.uid);
    const user = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const userSnapshot = await getDocs(user);
    console.log("userSnapshot", userSnapshot);
    const userData = userSnapshot.docs[0].data();
    return {
        nickname: userData.nickname,
        fullname: userData.fullname,
        email: userData.email,
        uid: userData.uid
    }
}

async function isUserInDb(uid) {
    const users = query(collection(db, "users"), where("uid", "==", uid));
    const usersSnapshot = await getDocs(users);

    return !usersSnapshot.empty;
}

async function createUserInDb(uid, nickname, fullname, email) {
    if (await isUserInDb(uid))
        return;

    try {
        const docRef = await addDoc(collection(db, "users"), {
            uid: uid,
            nickname: nickname,
            fullname: fullname,
            email: email
        });
        console.log("User ", nickname, " added with ID ", docRef.id, "uid: ", uid);
    } catch (err) {
        console.log("Error while adding a user: ", err);
    }
}

accountApi.signUpWithEmailAndPassword = function(email, password, nickname, fullname) {
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
        .then(async() => {
            console.log("Successfully signed up");
            await createUserInDb(auth.currentUser.uid, nickname, fullname, email);
            return true;
        })
        .catch((error) => {
            console.log("Error while signing up: ", error.code, error.message);
            return false;
        });
}

accountApi.signInWithEmail = function(email, password, store) {
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password).then(async() => {
        store.commit('setLoggedIn', { user: await getUserFromDbOnSignIn(auth) });
        return true;
    }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
        return false;
    });
}

accountApi.signInWithGoogle = function(store) {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider).then(async() => {
        const user = auth.currentUser;
        console.log("const user = auth.currentUser: ", user);
        await createUserInDb(user.uid, user.email.split('@')[0], user.displayName, user.email);
    }).then(async() => {
        store.commit('setLoggedIn', { user: await getUserFromDbOnSignIn(auth) });
    }).catch((error) => {
        console.log("accountApi.signInWithGoogle error.code: ", error.code);
        console.log("accountApi.signInWithGoogle error.message: ", error.message);
    });
}

accountApi.signOut = function(store) {
    const auth = getAuth(app);
    signOut(auth).then(() => {
        store.commit('setLoggedOff');
    }).catch((error) => {
        console.log(error);
    });
}

export default accountApi;