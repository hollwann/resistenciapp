import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

// firebase init goes here

let config = {
  apiKey: 'AIzaSyDdTjXlh632t16GrzTM7vAZ7HATB_IbJ7M',
  authDomain: 'parapp-ff452.firebaseapp.com',
  databaseURL: 'https://parapp-ff452.firebaseio.com',
  projectId: 'parapp-ff452',
  storageBucket: 'parapp-ff452.appspot.com',
  messagingSenderId: '68912886315',
  appId: '1:68912886315:web:e2e51835ec5ea6ec93b06e'
}

firebase.initializeApp(config)

firebase
  .auth()
  .signInAnonymously()
  .catch(error => {
    // Handle Errors here.
    window.alert(
      'No estas conectado a internet, asi no podras compartir tu ubiación.'
    )
    console.log(error)
  })

firebase.firestore().enablePersistence()
// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const storageRef = firebase.storage().ref()

export { db, auth, storageRef }
