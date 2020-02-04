<!-- 
  This route should only be accessed by users
  that has the following roles/permissions:

  Editor or Administrator
 -->

<script>
  export let router

  import { Link, navigateTo } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'
  import { years } from '../plugins/graduationInformation.js'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'
  import NoPermission from '../components/NoPermission.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let roles = []

  function addRole() {
    roles.push({
      Definition: document.getElementById('newDefinition').value.trim(),
      ID: document.getElementById('newID').value.trim(),
    })

    document.getElementById('newDefinition').value = ''
    document.getElementById('newID').value = ''

    document.getElementById('newDefinition').focus()

    roles = roles
  }

  function removeRole(i) {
    if (roles[i]['ID'] === 'AVR' ||
        roles[i]['ID'] === 'OIC' ||
        roles[i]['ID'] === 'AIC')
        return M.toast({ html: 'That role cannot be removed!', displayLength: 3000 })

    roles.splice(i, 1)

    document.getElementById('newDefinition').focus()

    roles = roles
  }

  function syncRoles(e) {
    const data = e.detail.data

    data['Roles'].forEach(role => {
      roles.push({ Definition: role['Definition'], ID: role['ID'] })
    })
  }

  function saveChanges(ref) {
    ref.set({
      'Event Year': Number(document.getElementById('eventYear').value),
      'Event Name': document.getElementById('eventName').value.trim(),
      'Google Drive': document.getElementById('googleDrive').value.trim() || null,
      'Roles': roles,
    }, { merge: true })
    .then(() => {
      M.toast({ html: 'Event data successfully updated.', displayLength: 3000 })
      return navigateTo('/manage/events/' + router.params.id + '/view')
    })
    .catch(() => {
      return M.toast({ html: 'An error occurred.', displayLength: 3000 })
    })
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
  <title>RIVAlumni | Edit Event</title>
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
          let:ref
          let:data={ event }
          on:data={ e => syncRoles(e) }
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

              <div class="row valign-wrapper">
                <div class="col s5 m6 l6 bold">Definition</div>
                <div class="col s5 m6 l6 bold">ID</div>
                <div class="col s2 m1 l1 bold">Action</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s5 m6 l6">
                  <input id="newDefinition" type="text" placeholder="Overall In-Charge">
                </div>

                <div class="col s5 m6 l6">
                  <input id="newID" type="text" placeholder="OIC">
                </div>

                <div class="col s2 m1 l1">
                  <button class="btn-flat waves-effect waves-light" on:click={ addRole }>
                    <i class="material-icons">check</i>
                  </button>
                </div>
              </div>

              { #each roles as role, i }
                <div class="row valign-wrapper">
                  <div class="col s5 m6 l6 truncate">{ role['Definition'] }</div>
                  <div class="col s5 m6 l6 truncate">{ role['ID'] }</div>
                  <div class="col s2 m1 l1">
                    <button class="btn-flat waves-effect waves-light" on:click={ () => removeRole(i) }>
                      <i class="material-icons">close</i>
                    </button>
                  </div>
                </div>
              { /each }
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
