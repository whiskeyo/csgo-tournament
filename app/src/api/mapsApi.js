import { db } from "../configs/db";
import { getDocs, collection } from "firebase/firestore";

const mapsApi = {};

mapsApi.collectMaps = async function (allMaps) {
  allMaps.length = 0;
  const querySnapshot = await getDocs(collection(db, "maps"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    console.log("data ====> ", data);
    allMaps.push({
      id: doc.id,
      name: data.name,
      matchesPlayed: data.matches_played,
      roundsWonByCt: data.rounds_won_by_ct,
      roundsWonByT: data.rounds_won_by_t,
    });
  });
};

export default mapsApi;
