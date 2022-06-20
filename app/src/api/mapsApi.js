/** @namespace mapsApi */

import { db } from "../configs/db";
import { doc, updateDoc, addDoc, getDocs, collection } from "firebase/firestore";
import objectGenerators from "../services/objectGenerators";

const mapsApi = {};

/**
 * Populates Firestore Database with official CSGO maps
 * @method
 */
mapsApi.populateDbWithAllMaps = async function () {
  await Promise.all([
    addDoc(collection(db, "maps"), objectGenerators.createMapObject("Mirage")),
    addDoc(collection(db, "maps"), objectGenerators.createMapObject("Dust 2")),
    addDoc(collection(db, "maps"), objectGenerators.createMapObject("Inferno")),
    addDoc(collection(db, "maps"), objectGenerators.createMapObject("Ancient")),
    addDoc(collection(db, "maps"), objectGenerators.createMapObject("Nuke")),
    addDoc(collection(db, "maps"), objectGenerators.createMapObject("Vertigo")),
    addDoc(collection(db, "maps"), objectGenerators.createMapObject("Overpass")),
  ]).then(() => console.log("Maps added successfully!"));
}

/**
 * @method
 * @param {Array} allMaps Array in which all maps from DB are saved
 */
mapsApi.collectMaps = async function (allMaps) {
  allMaps.length = 0;
  const querySnapshot = await getDocs(collection(db, "maps"));
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    allMaps.push({
      id: doc.id,
      name: data.name,
      matchesPlayed: data.matches_played,
      roundsWonByCt: data.rounds_won_by_ct,
      roundsWonByT: data.rounds_won_by_t,
    });
  });
};

/**
 * @method
 * @param {string} mapId          ID of the map to be updated
 * @param {Object} fieldsToChange Object contating fields that are updated
 */
mapsApi.updateMap = async function (mapId, fieldsToChange) {
  try {
    const mapRef = doc(db, "maps", mapId);
    await updateDoc(mapRef, fieldsToChange);
  } catch (err) {
    console.log("Error while changing a map: ", err);
  }
};

export default mapsApi;
