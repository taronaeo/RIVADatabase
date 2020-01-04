import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

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
  roles: Roles
}

exports.createUserAccount = functions.auth.user().onCreate(user => {
  const data: User = {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
    displayName: user.displayName,
    roles: {
      Alumni: true
    }
  }

  return admin.firestore().doc('users/' + user.uid).set(data, { merge: true })
})
