<script>
  let id
  export let router

  import { Link } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'

  import MemberRemarks from '../components/MemberRemarks.svelte'
  import EventsParticipated from '../components/EventsParticipated.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'
</script>

<style>
  nav {
    padding: 0px 20px 0px 20px;
  }

  .bold {
    font-weight: bold;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Membership Profile</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }
      on:data={ e => id = router.params.id || e.detail.data['membershipID'] }>

      <Doc
        path={ '/members/' + id }
        traceId={ 'MemberDataDoc' }
        maxWait={ 5000 }
        let:data={ memberData }>

        <div class="container">
          { #if (userData['membershipID'] === id && userData.roles.Alumni) || (userData.roles.Editor || userData.roles.Administrator) }
            { #if memberData['Membership Status'] === 'BLACKLISTED' }
              <nav class="red">
                <div class="nav-wrapper">
                  <div class="col s12 white-text">
                    <i class="material-icons left">warning</i>
                    Warning: This member is currently blacklisted.
                  </div>
                </div>
              </nav>
            { /if }

            <h3>Membership Profile</h3>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Membership ID</div>
              <div class="col s6 truncate">{ memberData['Membership ID'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Full Name</div>
              <div class="col s6 truncate">{ memberData['Full Name'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Gender</div>
              <div class="col s6 truncate">{ memberData['Gender'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Email</div>
              <div class="col s6 truncate">{ memberData['Email'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Current School</div>
              <div class="col s6 truncate">{ memberData['Current School'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Contact Number</div>
              <div class="col s6 truncate">{ memberData['Contact Number'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Home Number</div>
              <div class="col s6 truncate">{ memberData['Home Number'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Graduating Class</div>
              <div class="col s6 truncate">{ memberData['Graduating Class'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Graduating Year</div>
              <div class="col s6 truncate">{ memberData['Graduating Year'] }</div>
            </div>

            { #if userData.roles.Editor || userData.roles.Administrator }
              <div class="row valign-wrapper">
                <div class="col s6 bold">Membership Status</div>
                <div class="col s6 truncate">{ memberData['Membership Status'] }</div>
              </div>
            { /if }

            <div class="divider"></div>

            <h3>Emergency Contact Details</h3>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Name Of Next-Of-Kin</div>
              <div class="col s6 truncate">{ memberData['Name Of Next-Of-Kin'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Relationship With Next-Of-Kin</div>
              <div class="col s6 truncate">{ memberData['Relationship With Next-Of-Kin'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Contact Number Of Next-Of-Kin</div>
              <div class="col s6 truncate">{ memberData['Contact Number Of Next-Of-Kin'] }</div>
            </div>

            <div class="divider"></div>

            <EventsParticipated { id } { userData } />

            <div class="divider"></div>

            <MemberRemarks { id } />

            <div class="fixed-action-btn">
              <Link href="/manage/members/{ id }/edit">
                <button class="btn-floating btn-large deep-orange pulse">
                  <i class="material-icons">mode_edit</i>
                </button>
              </Link>
            </div>
          { :else }
            <p>
              Error 401, Unauthorized User. The user { userData.displayName } ({ userData.email }) is unauthorized to access this page.
              This error occurred because the account that you are currently signed into has not been linked to any RIVAlumni Membership Accounts.
              If you believe this is an error or require further assistance, please contact Aaron Teo (aaron.teo@riv-alumni.com)
            </p>
          { /if }
        </div>

        <div slot="loading">
          <div class="container">
            <div class="progress">
              <div class="indeterminate"></div>
            </div>
          </div>
        </div>

        <div slot="fallback">
          <div class="container">
            <p>
              An error has occurred. Please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
            </p>
          </div>
        </div>
      </Doc>

      <div slot="loading">
        <div class="container">
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
        </div>
      </div>

      <div slot="fallback">
        <div class="container">
          <p>
            An error has occurred. Please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
          </p>
        </div>
      </div>
    </Doc>
  </User>
</FirebaseApp>
