<script>
  let id
  export let router

  import { Link } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'

  import Error from '../components/Error.svelte'
  import NoPermission from '../components/NoPermission.svelte'
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

      { #if (userData['membershipID'] === id && userData.roles.Alumni) || (userData.roles.Editor || userData.roles.Administrator) }
        <Doc
          path={ '/members/' + id }
          traceId={ 'MemberDataDoc' }
          maxWait={ 5000 }
          let:data={ memberData }>

          <div class="container">
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
              { #if memberData['Email'] == '' }
                <div class="col s6 truncate">
                  <i>NO DATA</i>
                </div>
              { :else }
                <div class="col s6 truncate">{ memberData['Email'] }</div>
              { /if }
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Current School</div>
              { #if memberData['Current School'] == '' }
                <div class="col s6 truncate">
                  <i>NO DATA</i>
                </div>
              { :else }
                <div class="col s6 truncate">{ memberData['Current School'] }</div>
              { /if }
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Contact Number</div>
              <div class="col s6 truncate">
                <a href="tel:+65{ memberData['Contact Number'] }" class="red-text">{ memberData['Contact Number'] }</a>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Home Number</div>
              { #if memberData['Home Number'] == '' || typeof memberData['Home Number'] == 'object' }
                <div class="col s6 truncate">
                  <i>NO DATA</i>
                </div>
              { :else }
                <div class="col s6 truncate">
                  <a href="tel:+65{ memberData['Home Number'] }" class="red-text">{ memberData['Home Number'] }</a>
                </div>
              { /if }
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
              <div class="col s6 truncate">
                <a href="tel:+65{ memberData['Contact Number Of Next-Of-Kin'] }" class="red-text">{ memberData['Contact Number Of Next-Of-Kin'] }</a>
              </div>
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
          </div>

          <div slot="loading">
            <div class="container">
              <div class="progress">
                <div class="indeterminate"></div>
              </div>
            </div>
          </div>

          <div slot="fallback">
            <Error />
          </div>
        </Doc>
      { :else }
        <NoPermission />
      { /if }

      <div slot="loading">
        <div class="container">
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
        </div>
      </div>

      <div slot="fallback">
        <Error />
      </div>
    </Doc>
  </User>
</FirebaseApp>
