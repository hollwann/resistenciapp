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
  if (typeof data.comment === "string" &&  data.comment.length <= 140 ) {
    comment = data.comment;
  } else {
    comment = "";
  }
  if (
    typeof data.currentStatus === "string" 
  ) {
    currentStatus = data.currentStatus;
  } else {
    currentStatus = "";
  }
  if (typeof data.photoUrl === "string" ) {
    photoUrl = data.photoUrl;
  } else {
    photoUrl = "";
  }
  if (
    typeof data.location[0] === "number"  &&
      typeof data.location[1] === "number"
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

export const update_location = functions.https.onCall(async (data, context) => {
  const user_uid = context.auth ? context.auth.uid : ''
  if (user_uid === '') {
    const uid_ = context.auth.uid || null;
    console.error('[Update location] There was an error with uid:', uid_);
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.')
  }
  let location: GeoPoint;
  let geohash: String;
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
  const updateData = {
    location:location,
    geohash:geohash,
  }
return await update(updateData,'users',user_uid);
})

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

function update(data: any, collection: any,id:any) {
  return new Promise((resolve, reject) => {
      const userRef = db.collection(collection).doc(id)
      userRef.update(data).then(function () {
          resolve({
              res: '200'
          })
      }).catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
          resolve({
              res: '4c014'
          })
      });
  })
}
