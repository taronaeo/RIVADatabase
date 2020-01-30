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

interface MembersList {
  'Full Name': string;
  'Membership ID': string;
}

interface EventsList {
  'Event Code': number;
  'Event Name': string;
}

interface ParticipationsList {
  'Event Year': number;
  'Event Code': number;
  'Event Name': string;
  'Member ID': string;
  'Full Name': string;
  'VIA Hours': number;
}

interface User {
  uid: string;
  email: string | undefined;
  photoURL: string | undefined;
  displayName: string | undefined;
  membershipID: string | null;
  roles: Roles
}

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

interface Event {
  'Event Year'?: number;
  'Event Code'?: number;
  'Event Name'?: string;
  'Event Overall In-Charge'?: string;
  'Event Assistant In-Charge'?: string;
}

interface Participation {
  'Event Code': number;
  'Member ID': string;
  'Full Name': string;
  'Role': string;
  'VIA Hours': number;
}

interface UserAggregation {
  'usersCount': number;
}

interface MemberAggregation {
  'members': Array<MembersList>;
  'membersCount': number;
}

interface EventAggregation {
  'events': Array<EventsList>;
  'eventsCount': number;
}

interface ParticipationAggregation {
  'participations': Array<ParticipationsList>;
  'participationsCount': number;
}

// Functions provide code maintainability
// and reusability when database operations
// get more complex and code understandability
// becomes more difficult. Any removal of
// existing functions may cause a catastrophic
// failure in database operations. Hence,
// proceed with caution.
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

// Firestore onCreate event listeners

exports.newMember = functions.firestore
  .document('members/{memberID}')
  .onCreate(async (snap, context) => {
    const memberID = context.params.memberID
    const member: Member = {
      "Membership ID": memberID
    }

    return await database.collection('/members').doc(memberID)
      .set(member, { merge: true })
      .catch(err => console.error(err))
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
    const event: Event = {}
    const eventOIC = snap.data()!["Event Overall In-Charge"]
    const eventAIC = snap.data()!["Event Assistant In-Charge"]

    await database.collection('members').where('Membership ID', '==', eventOIC).limit(1).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const participation: Participation = {
            "Event Code": snap.data()!['Event Code'],
            "Member ID": snap.data()!["Event Overall In-Charge"],
            "Full Name": doc.data()['Full Name'],
            "Role": "OIC",
            "VIA Hours": 0,
          }

          event['Event Overall In-Charge'] = doc.data()['Full Name']

          database.collection('participation').add(participation).catch(err => console.error(err))
        })
      })
      .catch(err => console.error(err))

    await database.collection('members').where('Membership ID', '==', eventAIC).limit(1).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const participation: Participation = {
            "Event Code": snap.data()!['Event Code'],
            "Member ID": snap.data()!["Event Assistant In-Charge"],
            "Full Name": doc.data()['Full Name'],
            "Role": "AIC",
            "VIA Hours": 0,
          }

          event['Event Assistant In-Charge'] = doc.data()['Full Name']

          database.collection('participation').add(participation).catch(err => console.error(err))
        })
      })
      .catch(err => console.error(err))
    
    return database.collection('events').doc(context.params.eventID).set(event, { merge: true })
      .catch(err => console.error(err))
  })

// Database aggregation functions
exports.newUserAggregation = functions.firestore
  .document('users/{userID}')
  .onCreate(async (snap, context) => {
    await database.collection('users').doc('dataAggregation').get().then(snapshot => {
      const userAggregation: UserAggregation = {
        usersCount: ++snapshot.data()!['usersCount']
      }

      return snapshot.ref.set(userAggregation, { merge: true }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })

exports.newMemberAggregation = functions.firestore
  .document('members/{memberID}')
  .onCreate(async (snap, context) => {
    await database.collection('members').doc('dataAggregation').get().then(snapshot => {
      const memberList: MembersList = {
        "Membership ID": context.params.memberID,
        "Full Name": snap.data()!['Full Name'],
      }

      const memberAggregation: MemberAggregation = {
        members: snapshot.data()!['members'],
        membersCount: ++snapshot.data()!['membersCount']
      }

      memberAggregation.members.push(memberList)
      memberAggregation.members = memberAggregation.members.sort(compareMembers)

      return snapshot.ref.set(memberAggregation, { merge: true }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })

exports.newEventAggregation = functions.firestore
  .document('events/{eventID}')
  .onCreate(async (snap, context) => {
    await database.collection('events').doc('dataAggregation').get().then(snapshot => {
      const eventsList: EventsList = {
        "Event Code": Number(context.params.eventID),
        "Event Name": snap.data()!['Event Name'],
      }

      const eventAggregation: EventAggregation = {
        events: snapshot.data()!['events'],
        eventsCount: ++snapshot.data()!['eventsCount'],
      }

      eventAggregation.events.push(eventsList)
      eventAggregation.events = eventAggregation.events.sort(compareEvents)

      return snapshot.ref.set(eventAggregation, { merge: true }).catch(err => console.error(err))
    }).catch(err => console.error(err))
  })

exports.newParticipationAggregation = functions.firestore
  .document('participations/{participationID}')
  .onCreate(async (snap, context) => {
    const eventCode = snap.data()!['Event Code']

    await database.collection('events').where('Event Code', '==', eventCode).limit(1).get().then(snapshot => {
      snapshot.forEach(async event => {
        await database.collection('participations').doc('dataAggregation').get().then(aggregation => {
          const participationsList: ParticipationsList = {
            'Event Year': Number(event.data()['Event Year']),
            'Event Code': Number(eventCode),
            'Event Name': event.data()['Event Name'],
            'Member ID': snap.data()!['Member ID'],
            'Full Name': snap.data()!['Full Name'],
            'VIA Hours': Number(snap.data()!['VIA Hours']),
          }

          const participationAggregation: ParticipationAggregation = {
            'participations': aggregation.data()!['participations'],
            'participationsCount': ++aggregation.data()!['participationsCount']
          }

          participationAggregation.participations.push(participationsList)
          participationAggregation.participations.sort(compareEvents)

          return aggregation.ref.set(participationAggregation, { merge: true }).catch(err => console.error(err))
        }).catch(err => console.error(err))
      })
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
exports.deleteUserAggregation = functions.firestore
  .document('users/{userID}')
  .onDelete(async (snap, context) => {
    await database.collection('users').doc('dataAggregation').get().then(snapshot => {
      const userAggregation: UserAggregation = {
        'usersCount': --snapshot.data()!['usersCount']
      }

      return snapshot.ref.set(userAggregation, { merge: true }).catch(err => console.error(err))
    }).catch(err => console.error(err))
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
exports.deleteMemberAggregation = functions.firestore
  .document('members/{memberID}')
  .onDelete(async (snap, context) => {
    await database.collection('members').doc('dataAggregation').get().then(snapshot => {
      const memberAggregation: MemberAggregation = {
        'members': snapshot.data()!['members'],
        'membersCount': --snapshot.data()!['membersCount']
      }

      memberAggregation.members.filter((value: any) => {
        return value['Membership ID'] !== context.params.memberID
      })

      return snapshot.ref.set(memberAggregation, { merge: true }).catch(err => console.error(err))
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
exports.deleteEventAggregation = functions.firestore
.document('events/{eventID}')
.onDelete(async (snap, context) => {
  await database.collection('events').doc('dataAggregation').get().then(snapshot => {
    const eventAggregation: EventAggregation = {
      'events': snapshot.data()!['events'],
      'eventsCount': --snapshot.data()!['eventsCount'],
    }

    eventAggregation.events.filter((value: any) => {
      return value['Event Code'] !== context.params.eventID
    })

    return snapshot.ref.set(eventAggregation, { merge: true }).catch(err => console.error(err))
  }).catch(err => console.error(err))

  await database.collection('participations').where('Event Code', '==', context.params.eventID).get().then(snapshot => {
    snapshot.forEach(doc => {
      doc.ref.delete().catch(err => console.error(err))
    })
  }).catch(err => console.error(err))
})

// exports.deleteParticipationAggregation = functions.firestore
//   .document('participations/{participationID}')
//   .onDelete(async (snap, context) => {
//     await database.collection('participations').doc('dataAggregation').get().then(snapshot => {
//       const participationAggregation: ParticipationAggregation = {
//         'participations': snapshot.data()!['participations'],
//         'participationsCount': --snapshot.data()!['participationsCount'],
//       }

//       participationAggregation.participations.filter((value: any) => {
//         console.log(snap.data()!['Member ID'])
//         console.log(snap.data()!['Event Code'])

//         return value['Member ID'] != snap.data()!['Member ID']
//             && value['Event Code'] != snap.data()!['Event Code']
//       })

//       return snapshot.ref.set(participationAggregation, { merge: true }).catch(err => console.error(err))
//     }).catch(err => console.error(err))
//   })
