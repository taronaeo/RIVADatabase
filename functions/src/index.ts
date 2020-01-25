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

interface Participation {
  "Event Code": number;
  "Member ID": string;
  "Full Name": string;
  "Role": string;
  "VIA Hours": number;
}

function compareEvents(a: any, b: any) {
  const eventA = a['Event Code']
  const eventB = b['Event Code']

  let comparison = 0

  if (eventA > eventB) {
    comparison = 1
  } else if (eventA < eventB) {
    comparison = -1
  }

  return comparison * -1
}

function compareMembers(a: any, b: any) {
  const memberA = a['Full Name']
  const memberB = b['Full Name']
  
  let comparison = 0
  
  if (memberA > memberB) {
    comparison = 1
  } else if (memberA < memberB) {
    comparison = -1
  }

  return comparison
}

exports.newMember = functions.firestore
  .document('members/{memberID}')
  .onCreate(async (snap, context) => {
    const membershipID = context.params.memberID

    return await database.collection('/members').doc(membershipID).set({
      'Membership ID': membershipID
    }, { merge: true }).catch(err => console.error(err))
  })

exports.newMemberAggregation = functions.firestore
  .document('members/{memberID}')
  .onCreate(async (snap, context) => {
    const membershipID = context.params.memberID
    const fullName = snap.data()!['Full Name']

    await database.collection('members').doc('dataAggregation').get().then(snapshot => {
      const members = snapshot.data()!['members']
      let membersCount = snapshot.data()!['membersCount']

      members.push({
        'Full Name': fullName,
        'Membership ID': membershipID,
      })

      const sortedMembers = members.sort(compareMembers)

      return database.collection('members').doc('dataAggregation').set({
        'members': sortedMembers,
        'membersCount': ++membersCount,
      }, { merge: true }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })

exports.newEventAggregation = functions.firestore
  .document('events/{eventID}')
  .onCreate(async (snap, context) => {
    const eventID = context.params.eventID
    const eventName = snap.data()!['Event Name']

    await database.collection('events').doc('dataAggregation').get().then(snapshot => {
      const events = snapshot.data()!['events']
      let eventsCount = snapshot.data()!['eventsCount']

      events.push({
        'Event Code': Number(eventID),
        'Event Name': eventName,
      })

      const sortedEvents = events.sort(compareEvents)

      return database.collection('events').doc('dataAggregation').set({
        'events': sortedEvents,
        'eventsCount': ++eventsCount,
      }, { merge: true }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })

exports.createUserAccount = functions.auth.user().onCreate(async user => {
  let alumni = false
  let membershipID = null;

  await database.collection('members').where('Email', '==', user.email).limit(1).get().then(snapshot => {
    snapshot.forEach(doc => {
      if (user.email === doc.data()['Email']) {
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

exports.newEvent = functions.firestore
  .document('events/{eventID}')
  .onCreate(async (snap, context) => {
    const data = snap.data()
    const eventID = context.params.eventID

    await database.collection('members').where('Membership ID', '==', data!["Event Overall In-Charge"]).limit(1).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const eventOIC = doc.data()['Full Name']
          const participation: Participation = {
            "Event Code": data!['Event Code'],
            "Member ID": data!["Event Overall In-Charge"],
            "Full Name": eventOIC,
            "Role": "OIC",
            "VIA Hours": 0,
          }

          database.collection('events').doc(eventID).set({
            'Event Overall In-Charge': eventOIC
          }, { merge: true }).catch(err => console.error(err))

          database.collection('participation').add(participation).catch(err => console.error(err))
        })
      })
      .catch(err => console.error(err))

    await database.collection('members').where('Membership ID', '==', data!["Event Assistant In-Charge"]).limit(1).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const eventAIC = doc.data()['Full Name']
          const participation: Participation = {
            "Event Code": data!['Event Code'],
            "Member ID": data!["Event Assistant In-Charge"],
            "Full Name": eventAIC,
            "Role": "AIC",
            "VIA Hours": 0,
          }

          database.collection('events').doc(eventID).set({
            'Event Assistant In-Charge': eventAIC
          }, { merge: true }).catch(err => console.error(err))

          database.collection('participation').add(participation).catch(err => console.error(err))
        })
      })
      .catch(err => console.error(err))
  })