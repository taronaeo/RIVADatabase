<script>
  import { Link, navigateTo } from 'yrv'
  import { FirebaseApp, Collection, User, Doc } from 'sveltefire'
  import { years } from '../plugins/graduationInformation.js'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let roles = []

  function createEvent() {
    let eventOIC = document.getElementById('eventOIC')
    let eventAIC = document.getElementById('eventAIC')

    if (document.getElementById('eventCode').value == '')
      return M.toast({ html: 'Event Code must not be empty!', displayLength: 3000 })

    if (!/^(\d{8})$/g.test(Number(document.getElementById('eventCode').value)))
      return M.toast({ html: 'Event Code must be exactly 8 digits long!'})
    
    if (document.getElementById('eventName').value == '')
      return M.toast({ html: 'Event Name must not be empty!', displayLength: 3000 })

    if (eventOIC.options[eventOIC.selectedIndex].innerText == eventAIC.options[eventAIC.selectedIndex].innerText)
      return M.toast({ html: 'The same person must not be in both event roles!', displayLength: 3000 })

    firebase.firestore().collection('events').doc(document.getElementById('eventCode').value).set({
      'Event Year': Number(document.getElementById('eventYear').value),
      'Event Code': Number(document.getElementById('eventCode').value),
      'Event Name': document.getElementById('eventName').value.toUpperCase(),
      'Google Drive': document.getElementById('googleDrive').value || null,
      'Event Overall In-Charge': eventOIC.options[eventOIC.selectedIndex].innerText,
      'Event Assistant In-Charge': eventAIC.options[eventAIC.selectedIndex].innerText,
      'Roles': roles,
    }, { merge: true })
      .then(() => {
        M.toast({ html: 'Event successfully created', displayLength: 3000 })
        return navigateTo('/manage/events/' + document.getElementById('eventCode').value + '/view')
      })
      .catch(() => {
        return M.toast({ html: 'An error occurred', displayLength: 3000 })
      })
  }

  function addRole() {
    roles.push({
      Definition: document.getElementById('newDefinition').value,
      ID: document.getElementById('newID').value,
    })

    document.getElementById('newDefinition').value = ''
    document.getElementById('newID').value = ''

    roles = roles
  }

  function removeRole(i) {
    roles.splice(i, 1)
    roles = roles
  }

  function generateRoles() {
    roles.push(
      {
        Definition: 'Overall In-Charge',
        ID: 'OIC',
      },
      {
        Definition: 'Assistant In-Charge',
        ID: 'AIC',
      }
    )
  }

  function initializeSelect() {
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }
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
  <title>RIVAlumni | Create Event</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      <Collection
        path={ '/members' }
        query={ ref => ref.orderBy('Full Name', 'asc') }
        traceId={ 'MembersDataCollection' }
        maxWait={ 5000 }
        let:data={ members }
        on:data={ generateRoles }
        on:data={ () => window.setTimeout(initializeSelect, 500) }>

        <div class="container">
          { #if userData.roles.Editor || userData.roles.Administrator }
            <nav class="white">
              <div class="nav-wrapper">
                <div class="col s12">
                  <Link href="/manage/events" class="black-text left left-align">
                    <i class="material-icons left">block</i>
                    Cancel
                  </Link>

                  <a href="#!" class="black-text right right-align modal-trigger" on:click|preventDefault|stopPropagation={ createEvent }>
                    <i class="material-icons right">done</i>
                    Create Event
                  </a>
                </div>
              </div>
            </nav>

            <h3>Create Event</h3>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Year</div>
              <div class="col s6">
                <select id="eventYear">
                  { #each years as year }
                    <option value="{ year }">{ year }</option>
                  { /each }
                </select>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Code</div>
              <div class="col s6">
                <input id="eventCode" type="number" placeholder="YYYYMMDD">
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Name</div>
              <div class="col s6">
                <input id="eventName" type="text" placeholder="STUDENT LEADERSHIP CAMP">
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Google Drive</div>
              <div class="col s6">
                <input id="googleDrive" type="url" placeholder="https://drive.google.com/drive/...">
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Overall In-Charge</div>
              <div class="col s6">
                <!-- FIXME: This system might get costly overtime as more members join -->
                <select id="eventOIC">
                  { #each members as member }
                    <option value="{ member['Membership ID'] }">{ member['Full Name'] }</option>
                  { /each }
                </select>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Event Assistant In-Charge</div>
              <div class="col s6">
                <!-- FIXME: This system might get costly overtime as more members join -->
                <select id="eventAIC">
                  { #each members as member }
                    <option value="{ member['Membership ID'] }">{ member['Full Name'] }</option>
                  { /each }
                </select>
              </div>
            </div>

            <div class="divider"></div>

            <h3>Roles</h3>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Definition</div>
              <div class="col s6 bold">ID</div>
              <div class="col s1 bold">Action</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6">
                <input id="newDefinition" type="text" placeholder="Overall In-Charge">
              </div>

              <div class="col s6">
                <input id="newID" type="text" placeholder="OIC">
              </div>

              <div class="col s1">
                <button class="btn-flat waves-effect waves-light" on:click={ addRole }>
                  <i class="material-icons">check</i>
                </button>
              </div>
            </div>

            { #each roles as role, i }
              <div class="row valign-wrapper">
                <div class="col s6 truncate">{ role['Definition'] }</div>
                <div class="col s6 truncate">{ role['ID'] }</div>
                <div class="col s1">
                  <button class="btn-flat waves-effect waves-light" on:click={ () => removeRole(i) }>
                    <i class="material-icons">close</i>
                  </button>
                </div>
              </div>
            { /each }

            <div class="divider"></div>

            <h3>Participation Records</h3>

            <p>The event must be created first in order for participation records to be added</p>
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
      </Collection>

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