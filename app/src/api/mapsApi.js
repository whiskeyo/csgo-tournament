import { db } from "../configs/db";
import { getDocs, collection } from "firebase/firestore";

const mapsApi = {};

mapsApi.collectMaps = async function (allMaps) {
  allMaps.length = 0;
  const querySnapshot = await getDocs(collection(db, "maps"));
  console.log("querySnapshot (maps): ", querySnapshot);
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allMaps.push({
      name: data.name,
      matches_played: data.matches_played,
      rounds_won_by_t: data.rounds_won_by_t,
      rounds_won_by_ct: data.rounds_won_by_ct
    });
  });
};

export default mapsApi;
