// If running the command `firebase deploy --only functions` does not work
// and produces the following error: 
// `Deployment error.
// Build failed: {
//  "cacheStats": [
//    {"status": "MISS",
//       "hash": "e03d8d6f6bf22fcb1cf50f4e12b3e3a3b59954fade707db62e79562c9dbac3ef",
//       "type": "docker_layer_cache",
//      "level": "global"
//    },
//    {"status": "HIT",
//       "hash": "e03d8d6f6bf22fcb1cf50f4e12b3e3a3b59954fade707db62e79562c9dbac3ef",
//       "type": "docker_layer_cache",
//      "level": "project"
//    }
//  ]
// }`
// Do know that Google's Development Team is fixing and/or tinkering with some
// runtime code. Continuiously retry the deployment and it will succeed at some point.

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

const database = admin.firestore()

interface Roles {
  Alumni?: boolean;
  Editor?: boolean;
  Administrator?: boolean;
}

interface User {
  uid: string;
  email: string | undefined;
  photoURL: string | undefined;
  displayName: string | undefined;
  membershipID: string | null;
  roles: Roles
}

exports.newMember = functions.firestore
  .document('members/{memberID}')
  .onCreate(async (snap, context) => {
    const membershipID = context.params.memberID

    return await database.collection('/members').doc(membershipID).set({
      'Membership ID': membershipID
    }, { merge: true }).catch(err => console.error(err))
  })

exports.newEvent = functions.firestore
  .document('events/{eventID}')
  .onCreate(async (snap, context) => {
    const data = snap.data()

    console.log(data)
  })

exports.createUserAccount = functions.auth.user().onCreate(async user => {
  let alumni = false
  let membershipID = null;

  await database.collection('members').where('Email', '==', user.email).limit(1).get().then(snapshot => {
    snapshot.forEach(doc => {
      if (user.email == doc.data()['Email']) {
        alumni = true
        membershipID = doc.id
      }
    })
  }).catch(err => console.error(err))

  const data: User = {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
    displayName: user.displayName,
    membershipID: membershipID,
    roles: {
      Alumni: alumni
    }
  }

  return admin.firestore().doc('users/' + user.uid).set(data, { merge: true })
})
