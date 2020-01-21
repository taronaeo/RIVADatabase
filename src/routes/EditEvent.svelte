<script>
  export let router

  import { Link } from 'yrv'
  import { years } from '../plugins/graduationInformation.js'
  import { FirebaseApp, User, Doc } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function initializeSelect() {
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }
</script>

<style>
  nav {
    padding: 0px 20px 0px 20px;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Edit Event</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      <Doc
        path={ '/events/' + router.params.id }
        traceId={ 'EventDataDoc' }
        maxWait={ 5000 }
        let:data={ event }
        on:data={ () => window.setTimeout(initializeSelect, 500) }>

        <div class="container">
          { #if userData.roles.Editor || userData.roles.Administrator }
            <nav class="white">
              <div class="nav-wrapper">
                <div class="col s12">
                  <Link href="/manage/events/{ router.params.id }/view" class="black-text left left-align">
                    <i class="material-icons left">block</i>
                    Cancel
                  </Link>

                  <a href="#!" class="black-text right right-align" on:click|preventDefault|stopPropagation={ () => saveChanges(ref) }>
                    <i class="material-icons right">done</i>
                    Save Changes
                  </a>
                </div>
              </div>
            </nav>

            <h3>Edit Event</h3>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Year</div>
              <div class="col s6">
                <select id="eventYear">
                  { #each years as year }
                    <option value="{ year }" selected="{ event['Event Year'] == year }">{ year }</option>
                  { /each }
                </select>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Code</div>
              <div class="col s6 truncate">{ router.params.id }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Name</div>
              <div class="col s6">
                <input id="eventName" type="text" value={ event['Event Name'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Google Drive</div>
              <div class="col s6">
                <input id="googleDrive" type="text" value={ event['Google Drive'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Overall In-Charge</div>
              <div class="col s6 truncate">{ event['Event Overall In-Charge']}</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Assistant In-Charge</div>
              <div class="col s6 truncate">{ event['Event Assistant In-Charge'] }</div>
            </div>

            <div class="divider"></div>

            <h3>Roles</h3>
          { :else }
            <p>
              Error 403, Forbidden Route. The user { userData.displayName } ({ userData.email }) is unauthorized to access this page.
              Should this be a technical error, please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
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