"use strict";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GeoPoint } from "@google-cloud/firestore";
import * as Geohash from "ngeohash";
const db = admin.firestore();

/*
 {comment:string, currentStatus:string, location:object, photoUrl:string}
*/
export const new_comment = functions.https.onCall(async (data, context) => {
  let comment: String;
  let currentStatus: String;
  let photoUrl: String;
  let geohash: String;
  let location: GeoPoint;
  if (typeof data.comment === "string" || data.comment instanceof String) {
    comment = data.comment;
  } else {
    comment = "";
  }
  if (
    typeof data.currentStatus === "string" ||
    data.currentStatus instanceof String
  ) {
    currentStatus = data.currentStatus;
  } else {
    currentStatus = "";
  }
  if (typeof data.photoUrl === "string" || data.photoUrl instanceof String) {
    photoUrl = data.photoUrl;
  } else {
    photoUrl = "";
  }
  if (
    typeof data.location[0] === "number" ||
    (data.location[0] instanceof Number &&
      typeof data.location[1] === "number") ||
    data.location[1] instanceof Number
  ) {
    if (
      data.location[0] >= -90 &&
      data.location[0] <= 90 &&
      data.location[1] >= -90 &&
      data.location[1] <= 90
    ) {
      location = new GeoPoint(data.location[0], data.location[1]);
      geohash = Geohash.encode(data.location[0], data.location[1]);
    } else {
      return {
        res: "No es una ubicacion Valida"
      };
    }
  } else {
    return {
      res: "No es una ubicacion Valida"
    };
  }
  const commentData = {
    timestamp: admin.firestore.Timestamp.now(),
    comment: comment,
    currentStatus: currentStatus,
    location: location,
    locationHash: geohash,
    photoUrl: photoUrl,
    votes: 0,
    voters: []
  };
  return await addToFIreBase(commentData, "Comments");
});
 

function addToFIreBase(data: any, collection: any) {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .add(data)
      .then(function(docRef) {
        resolve({
          res: "200" // add correct
        });
      })
      .catch(function(error) {
        console.log("Error de base de datos", error);
        reject(Error("Error Al añadir a la base de datos"));
      });
  });
}
//943.05
