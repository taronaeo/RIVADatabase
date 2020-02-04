<!-- 
  This route should only be accessed by users
  that has the following roles/permissions:

  Editor or Administrator
 -->

<script>
  export let router

  import { Link } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'
  import NoPermission from '../components/NoPermission.svelte'
  import ParticipationRecords from '../components/ParticipationRecords.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'
</script>

<style>
  .bold {
    font-weight: bold;
  }

  nav {
    padding: 0px 20px 0px 20px;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Event Information</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      { #if userData.roles.Alumni }
        <Doc
          path={ '/events/' + router.params.id }
          traceId={ 'EventDataDoc' }
          maxWait={ 5000 }
          let:data={ event }>

          <div class="container">
            { #if userData.roles.Editor || userData.roles.Administrator }
              <nav class="white">
                <div class="nav-wrapper">
                  <div class="col s12">
                    <Link href="/manage/events" class="black-text left left-align">
                      <i class="material-icons left">arrow_back</i>
                      Go Back
                    </Link>

                    <Link href="/manage/events/{ router.params.id }/edit" class="black-text right right-align">
                      <i class="material-icons right">mode_edit</i>
                      Edit Event
                    </Link>
                  </div>
                </div>
              </nav>

              <h3>Event Information</h3>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Year</div>
                <div class="col s6 truncate">{ event['Event Year'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Code</div>
                <div class="col s6 truncate">{ router.params.id }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Name</div>
                <div class="col s6 truncate">{ event['Event Name'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Google Drive</div>
                <div class="col s6 truncate">
                  <a href={ event['Google Drive'] } class="red-text" target="_blank">
                    External Link
                  </a>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Overall In-Charge</div>
                <div class="col s6 truncate">{ event['Event Overall In-Charge'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Assistant In-Charge</div>
                <div class="col s6 truncate">{ event['Event Assistant In-Charge'] }</div>
              </div>

              <div class="divider"></div>

              <h3>Roles</h3>

              { #each event['Roles'] as role }
                <div class="row valign-wrapper">
                  <div class="col s6 bold">{ role['Definition'] }</div>
                  <div class="col s6">{ role['ID'] }</div>
                </div>
              { /each }

              <div class="divider"></div>

              <ParticipationRecords id={ router.params.id } />
            { :else }
              <NoPermission />
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
            <Error />
          </div>
        </Doc>
      { :else }
        <NoMembership />
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
