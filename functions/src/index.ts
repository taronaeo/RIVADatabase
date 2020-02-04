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

// Libraries required for Google Cloud Functions
// to work and operate properly. Any missing
// libraries would cause a catastrophic database
// operations failure. Hence, please import and
// remove all necessary libraries -- nothing else.
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initialize server-side Firebase Admin SDK
// Credentials are automatically handled by
// Google's Servers as they are already
// authenticated as the "sudo-user".
admin.initializeApp()

// Link Firestore Admin SDK to a
// variable
const database = admin.firestore()

// Indicates where the Cloud Functions are
// supposed to be deployed for better
// latency and throughput
const DEPLOYMENT_REGION = 'asia-east2'

// Interfaces provide a structure as to
// how the database should present and/or
// store data. All database operations
// should use interfaces for maintainability
// and reusability.

interface Roles {
  Alumni?: boolean;
  Editor?: boolean;
  Administrator?: boolean;
}

// Found In: /members/dataAggregation[members]
interface MembersList {
  'Full Name': string;
  'Membership ID': string;
}

// Found In: /events/dataAggregation[events]
interface EventsList {
  'Event Code': number;
  'Event Name': string;
}

// Found In: /participations/dataAggregation[participations]
interface ParticipationsList {
  'Participation ID': string;
  'Event Year': number;
  'Event Code': number;
  'Event Name': string;
  'Member ID': string;
  'Full Name': string;
  'VIA Hours': number;
}

// Found In: /users
interface User {
  uid: string;
  email: string | undefined;
  photoURL: string | undefined;
  displayName: string | undefined;
  membershipID: string | null;
  roles: Roles
}

// Found In: /members
interface Member {
  'Membership ID'?: string;
  'Full Name'?: string;
  'Gender'?: string;
  'Email'?: string;
  'Current School'?: string;
  'Contact Number'?: number;
  'Home Number'?: string;
  'Graduating Class'?: string;
  'Graduating Year'?: number;
  'Membership Status'?: string;
  'Name Of Next-Of-Kin'?: string;
  'Relationship With Next-Of-Kin'?: string;
  'Contact Number Of Next-Of-Kin'?: number;
}

// Found In: /events
interface Event {
  'Event Year'?: number;
  'Event Code'?: number;
  'Event Name'?: string;
  'Event Overall In-Charge'?: string;
  'Event Assistant In-Charge'?: string;
}

// Found In: /participations
interface Participation {
  'Event Code': number;
  'Member ID': string;
  'Full Name': string;
  'Role': string;
  'VIA Hours': number;
  'Remarks': string | null;
  'updatedAt': admin.firestore.FieldValue;
  'createdAt': admin.firestore.FieldValue;
}

// Found In: /users/dataAggregation
interface UserAggregation {
  'usersCount': admin.firestore.FieldValue;
}

// Found In: /members/dataAggregation
interface MemberAggregation {
  'members': admin.firestore.FieldValue;
  'membersCount': admin.firestore.FieldValue;
}

// Found In: /events/dataAggregation
interface EventAggregation {
  'events': admin.firestore.FieldValue;
  'eventsCount': admin.firestore.FieldValue;
}

// Found In: /participations/dataAggregation
interface ParticipationAggregation {
  'participations': admin.firestore.FieldValue;
  'participationsCount': admin.firestore.FieldValue;
}

// Functions provide code maintainability
// and reusability when database operations
// get more complex and code understandability
// becomes more difficult. Any removal of
// existing functions may cause a catastrophic
// failure in database operations. Hence,
// proceed with caution.
// function compareEvents(a: any, b: any) {
//   const eventA = a['Event Code']
//   const eventB = b['Event Code']

//   let comparison = 0

//   if (eventA > eventB) {
//     comparison = 1
//   } else if (eventA < eventB) {
//     comparison = -1
//   }

//   return comparison * -1
// }

// function compareMembers(a: any, b: any) {
//   const memberA = a['Full Name']
//   const memberB = b['Full Name']
  
//   let comparison = 0
  
//   if (memberA > memberB) {
//     comparison = 1
//   } else if (memberA < memberB) {
//     comparison = -1
//   }

//   return comparison
// }

// Firestore onCreate event listeners

// TESTED SUCCESS ON 3RD FEBRUARY 2020
exports.newMember = functions.region(DEPLOYMENT_REGION).firestore
  .document('members/{memberID}')
  .onCreate(async (snap, context) => {
    if (context.params.memberID === 'dataAggregation') return

    const batch = database.batch()
    const membersRef = database.collection('members').doc(context.params.memberID)

    const member: Member = {
      'Membership ID': context.params.memberID
    }

    return batch.set(membersRef, member, { merge: true }).commit()
      .catch(err => console.error(err))
  })

// TESTED SUCCESS ON 3RD FEBRUARY 2020
exports.createUserAccount = functions.region(DEPLOYMENT_REGION).auth
  .user()
  .onCreate(async user => {
    const userRef = database.collection('users').doc(user.uid)
    const membersRef = database.collection('members').where('Email', '==', user.email).limit(1)

    return database.runTransaction(transaction => {
      return transaction.get(membersRef).then(collection => {
        let alumni: boolean = false
        let membershipID: string | null = null

        collection.forEach(doc => {
          if (user.email === doc.data()['Email']) {
            alumni = true
            membershipID = doc.id
          }
        })

        const data: User = {
          'uid': user.uid,
          'email': user.email,
          'photoURL': user.photoURL,
          'displayName': user.displayName,
          'membershipID': membershipID,
          'roles': {
            Alumni: alumni
          }
        }

        return transaction.set(userRef, data, { merge: true })
      }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })

// TESTED SUCCESS ON 3RD FEBRUARY 2020
exports.newEvent = functions.region(DEPLOYMENT_REGION).firestore
  .document('events/{eventID}')
  .onCreate(async (snap, context) => {
    const prtRef = database.collection('participations')
    const eventRef = database.collection('events').doc(context.params.eventID)
    const memberOICRef = database.collection('members').where('Membership ID', '==', snap.data()!['Event Overall In-Charge']).limit(1)
    const memberAICRef = database.collection('members').where('Membership ID', '==', snap.data()!['Event Assistant In-Charge']).limit(1)

    return database.runTransaction(async transaction => {
      const event: Event = {}

      await transaction.get(memberOICRef).then(collection => {
        if (collection.empty) {
          console.error('Document does not exist!')
          return
        }

        collection.forEach(doc => {
          const participation: Participation = {
            'Event Code': snap.data()!['Event Code'],
            'Member ID': snap.data()!['Event Overall In-Charge'],
            'Full Name': doc.data()['Full Name'],
            'Role': 'OIC',
            'VIA Hours': 0,
            'Remarks': null,
            'updatedAt': admin.firestore.FieldValue.serverTimestamp(),
            'createdAt': admin.firestore.FieldValue.serverTimestamp(),
          }

          event['Event Overall In-Charge'] = doc.data()['Full Name']

          return prtRef.add(participation)
            .catch(err => console.error(err))
        })
      }).catch(err => console.error(err))

      await transaction.get(memberAICRef).then(collection => {
        if (collection.empty) {
          console.error('Document does not exist!')
          return
        }

        collection.forEach(doc => {
          const participation: Participation = {
            'Event Code': snap.data()!['Event Code'],
            'Member ID': snap.data()!['Event Assistant In-Charge'],
            'Full Name': doc.data()['Full Name'],
            'Role': 'AIC',
            'VIA Hours': 0,
            'Remarks': null,
            'updatedAt': admin.firestore.FieldValue.serverTimestamp(),
            'createdAt': admin.firestore.FieldValue.serverTimestamp(),
          }

          event['Event Assistant In-Charge'] = doc.data()['Full Name']

          return prtRef.add(participation)
            .catch(err => console.error(err))
        })
      }).catch(err => console.error(err))

      return transaction.set(eventRef, event, { merge: true })
    }).catch(err => console.error(err))
  })

// Database aggregation functions

// TESTED SUCCESS ON 3RD FEBRUARY 2020
exports.newUserAggregation = functions.region(DEPLOYMENT_REGION).firestore
  .document('users/{userID}')
  .onCreate(async (snap, context) => {
    const batch = database.batch()
    const userRef = database.collection('users').doc('dataAggregation')

    const userAggregation: UserAggregation = {
      'usersCount': admin.firestore.FieldValue.increment(1)
    }

    return batch.set(userRef, userAggregation, { merge: true }).commit()
      .catch(err => console.error(err))
  })

// TESTED SUCCESS ON 4TH FEBRUARY 2020
exports.newMemberAggregation = functions.region(DEPLOYMENT_REGION).firestore
  .document('members/{memberID}')
  .onCreate(async (snap, context) => {
    if (context.params.memberID === 'dataAggregation') return

    const batch = database.batch()
    const memberRef = database.collection('members').doc('dataAggregation')

    const memberList: MembersList = {
      'Membership ID': context.params.memberID,
      'Full Name': snap.data()!['Full Name'],
    }

    const memberAggregation: MemberAggregation = {
      'members': admin.firestore.FieldValue.arrayUnion(memberList),
      'membersCount': admin.firestore.FieldValue.increment(1),
    }

    return batch.set(memberRef, memberAggregation, { merge: true }).commit()
      .catch(err => console.error(err))
  })

// TESTED SUCCESS ON 3RD FEBRUARY 2020
exports.newEventAggregation = functions.region(DEPLOYMENT_REGION).firestore
  .document('events/{eventID}')
  .onCreate(async (snap, context) => {
    if (context.params.eventID === 'dataAggregation') return

    const batch = database.batch()
    const eventRef = database.collection('events').doc('dataAggregation')

    const eventsList: EventsList = {
      'Event Code': Number(context.params.eventID),
      'Event Name': snap.data()!['Event Name'],
    }

    const eventAggregation: EventAggregation = {
      'events': admin.firestore.FieldValue.arrayUnion(eventsList),
      'eventsCount': admin.firestore.FieldValue.increment(1),
    }

    return batch.set(eventRef, eventAggregation, { merge: true }).commit()
      .catch(err => console.error(err))
  })

// TESTED SUCCESS ON 3RD FEBRUARY 2020
exports.newParticipationAggregation = functions.region(DEPLOYMENT_REGION).firestore
  .document('participations/{participationID}')
  .onCreate(async (snap, context) => {
    if (context.params.participationID === 'dataAggregation') return

    const eventCode = snap.data()!['Event Code']
    const prtRef = database.collection('participations').doc('dataAggregation')
    const eventRef = database.collection('events').where('Event Code', '==', eventCode).limit(1)

    return database.runTransaction(transaction => {
      return transaction.get(eventRef).then(collection => {
        if (collection.empty) {
          console.error('Document does not exist!')
          return
        }

        collection.forEach(doc => {
          const participationsList: ParticipationsList = {
            'Participation ID': context.params.participationID,
            'Event Year': Number(doc.data()['Event Year']),
            'Event Code': Number(eventCode),
            'Event Name': doc.data()['Event Name'],
            'Member ID': snap.data()!['Member ID'],
            'Full Name': snap.data()!['Full Name'],
            'VIA Hours': Number(snap.data()!['VIA Hours']),
          }

          const participationAggregation: ParticipationAggregation = {
            'participations': admin.firestore.FieldValue.arrayUnion(participationsList),
            'participationsCount': admin.firestore.FieldValue.increment(1),
          }

          return transaction.set(prtRef, participationAggregation, { merge: true })
        })
      }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })

// Firebase onUpdate event listeners

// updateParticipationAggregation listens for any database
// update event that happens in the 'participations'
// collection.
//
// Order of operations:
// 1. Check if the update is coming from 'dataAggregation'
//    document.
// 2. Get 'dataAggregation' document
// 3. Extract participations array from the document
// 4. Find the Participation ID that is equivalent to
//    participationID, get the index
// 5. Update the participation object of the index
// 6. Push the new participations array and
//    participationsCount with the effect of +/- 0 to the
//    dataAggregation document

// TESTED SUCCESS ON 4TH FEBRUARY 2020
exports.updateParticipationAggregation = functions.region(DEPLOYMENT_REGION).firestore
  .document('participations/{participationID}')
  .onUpdate(async (change, context) => {
    if (context.params.participationID === 'dataAggregation') return

    const prtRef = admin.firestore().collection('participations').doc('dataAggregation')

    return admin.firestore().runTransaction(transaction => {
      return transaction.get(prtRef).then(async doc => {
        const prtArray: Array<ParticipationsList> = doc.data()!['participations']
        const oldPrt = prtArray.find(prt => prt['Participation ID'] === context.params.participationID)
        const oldPrtIdx = prtArray.findIndex(prt => prt['Participation ID'] === context.params.participationID)

        const newPrtObj: ParticipationsList = {
          'Participation ID': context.params.participationID,
          'Event Year': prtArray[oldPrtIdx]["Event Year"],
          'Event Code': prtArray[oldPrtIdx]["Event Code"],
          'Event Name': prtArray[oldPrtIdx]["Event Name"],
          'Member ID': prtArray[oldPrtIdx]["Member ID"],
          'Full Name': prtArray[oldPrtIdx]["Full Name"],
          'VIA Hours': (change.after.data() as ParticipationsList)["VIA Hours"]
        }

        const splicePrt: ParticipationAggregation = {
          'participations': admin.firestore.FieldValue.arrayRemove(oldPrt),
          'participationsCount': admin.firestore.FieldValue.increment(-1),
        }

        const pushPrt: ParticipationAggregation = {
          'participations': admin.firestore.FieldValue.arrayUnion(newPrtObj),
          'participationsCount': admin.firestore.FieldValue.increment(1),
        }

        await transaction.set(prtRef, splicePrt, { merge: true })
        return transaction.set(prtRef, pushPrt, { merge: true })
      }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })

// Firebase onDelete event listeners

// deleteUserAggregation listens for any database
// delete event that happens in the 'users'
// collection.
//
// Order of operations:
// 1. Get 'dataAggregation' document
// 2. Extract the usersCount from the document
// 3. Subtract usersCount by 1 and push the changes
//    to the document

// TESTED SUCCESS ON 4TH FEBRUARY 2020
exports.deleteUserAggregation = functions.region(DEPLOYMENT_REGION).firestore
  .document('users/{userID}')
  .onDelete(async (snap, context) => {
    const batch = database.batch()
    const userRef = database.collection('users').doc('dataAggregation')

    const userAggregation: UserAggregation = {
      'usersCount': admin.firestore.FieldValue.increment(-1),
    }

    return batch.set(userRef, userAggregation, { merge: true }).commit()
      .catch(err => console.error(err))
  })

// deleteMemberAggregation listens for any database
// delete event that happens in the 'members'
// collection.
//
// Order of operations:
// 1. Initialize memberID variable
// 2. Get 'dataAggregation' document
// 3. Extract membersCount from the document
// 4. Filter any Membership ID that isn't equivalent
//    to memberID
// 5. Push new members array and membersCount with
//    the subtraction by 1 to the dataAggregation
//    document

// TESTED SUCCESS ON 4TH FEBRUARY 2020
exports.deleteMemberAggregation = functions.region(DEPLOYMENT_REGION).firestore
  .document('members/{memberID}')
  .onDelete(async (snap, context) => {
    const memberRef = database.collection('members').doc('dataAggregation')

    return database.runTransaction(transaction => {
      return transaction.get(memberRef).then(doc => {
        if (!doc.exists) {
          console.error('Document does not exist!')
          return
        }

        const memberObj = (doc.data()!['members'] as Array<MembersList>).find(value => value['Membership ID'] === context.params.memberID)

        const memberAggregation: MemberAggregation = {
          'members': admin.firestore.FieldValue.arrayRemove(memberObj),
          'membersCount': admin.firestore.FieldValue.increment(-1),
        }

        return transaction.set(memberRef, memberAggregation, { merge: true })
      }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })

// deleteEventAggregation listens for any database
// delete event that happens in the 'events'
// collection.
//
// Order of operations:
// 1. Initialize eventID variable
// 2. Get 'dataAggregation' document
// 3. Extract eventsCount from the document
// 4. Filter any Event ID that isn't equivalent
//    to eventID
// 5. Push new events array and eventsCount with
//    the subtraction by 1 to the dataAggregation
//    document
// 6. Get 'participations' collection
// 7. Extract any document with the Event Code that
//    is equivalent to eventID
// 8. Delete the document
// 9. deleteParticipationAggregation will handle the
//    rest for aggregation.

// TESTED SUCCESS ON 4TH FEBRUARY 2020
exports.deleteEventAggregation = functions.region(DEPLOYMENT_REGION).firestore
.document('events/{eventID}')
.onDelete(async (snap, context) => {
  const eventList: EventsList = {
    'Event Code': snap.data()!['Event Code'],
    'Event Name': snap.data()!['Event Name'],
  }

  const eventAggregation: EventAggregation = {
    'events': admin.firestore.FieldValue.arrayRemove(eventList),
    'eventsCount': admin.firestore.FieldValue.increment(-1),
  }

  await database.collection('events').doc('dataAggregation').set(eventAggregation, { merge: true })
    .catch(err => console.error(err))

  await database.collection('participations').where('Event Code', '==', Number(context.params.eventID)).get()
    .then(snapshot => {
      snapshot.forEach(doc => doc.ref.delete()
        .catch(err => console.error(err)))
    })
    .catch(err => console.error(err))
})

// deleteParticipationAggregation listens for any database
// delete event that happens in the 'participations'
// collection.
//
// Order of operations:
// 1. Get 'dataAggregation' document
// 2. Filter out the Participation ID that is not
//    equivalent to participationID
// 3. Push the new participations array and
//    participationsCount with the addition by 1 to the
//    dataAggregation document

// TESTED SUCCESS ON 4TH FEBRUARY 2020
exports.deleteParticipationAggregation = functions.region(DEPLOYMENT_REGION).firestore
  .document('participations/{participationID}')
  .onDelete(async (snap, context) => {
    const prtRef = admin.firestore().collection('participations').doc('dataAggregation')

    return admin.firestore().runTransaction(transaction => {
      return transaction.get(prtRef).then(doc => {
        if (!doc.exists) {
          console.error('Document does not exist!')
          return
        }

        const prtObj = (doc.data()!['participations'] as Array<ParticipationsList>).find(value => value['Participation ID'] === context.params.participationID)
        const participationAggregation: ParticipationAggregation = {
          'participations': admin.firestore.FieldValue.arrayRemove(prtObj),
          'participationsCount': admin.firestore.FieldValue.increment(-1),
        }

        return transaction.set(prtRef, participationAggregation, { merge: true })
      }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })
