import { db } from "../configs/db";
import { getDocs, collection, documentId } from "firebase/firestore";

/* PROBABLY WILL BE UNUSED */
const scoreApi = {};

scoreApi.collectScoresFromMatch = async function (matchId) {
  const users = query(collection(db, "matches"), where(documentId(), "==", matchId));
  const usersSnapshot = await getDocs(users);

  allMatches.length = 0;
  const querySnapshot = await getDocs(collection(db, "maps"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allMatches.push({
      name: data.name,
      matches_played: data.matches_played,
      rounds_won_by_t: data.rounds_won_by_t,
      rounds_won_by_ct: data.rounds_won_by_ct,
    });
  });
};

export default scoreApi;
