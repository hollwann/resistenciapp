import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const db = admin.firestore();

exports.scheduledFunction =  functions.pubsub.schedule('every 10 minutes').onRun(async (context) => {
    const usersToDelete =  await getUsers() as any;
    console.log(usersToDelete.data)
    await deletUser(usersToDelete.data) as any;
    return  null;
  });

function deletUser(usersTo: string[]){
    return new Promise((resolve, reject) => {
        for(let i = 1;i<usersTo.length;i++){
            console.log(usersTo[i])
            db.collection("users").doc(usersTo[i]).delete().then(function() {
                console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        }
        resolve({
            res: 'ok',
        })
    })
}


function getUsers() {
return new Promise((resolve, reject) => {
    const datos = ['']
    const ahora = new Date()
 //   const datePass1 = new Date(ahora.getTime()-	1800000)
    const datePass1 = new Date(ahora.getTime()-	3600000)
    const refUsers = db.collection('users').where("timestamp",'<=',datePass1);
    refUsers.get()
            .then(snapshot => {
                if (snapshot.size > 0) {
                    snapshot.forEach(doc => {
                        datos.push(doc.id)
                })
                console.log(datos)
                resolve({
                    data: datos,
                })
            } 
        }).catch(err => {
            console.log("Error de base de datos", err);
            reject(Error("Error de base de datos"));
          });
})
}







