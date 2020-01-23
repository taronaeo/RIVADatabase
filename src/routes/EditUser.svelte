<!-- 
  This route should only be accessed by users
  that has the following roles/permissions:

  Editor or Administrator
 -->

<script>
  export let router

  import { Link, navigateTo } from 'yrv'
  import { roles } from '../plugins/userRoles.js'
  import { FirebaseApp, User, Doc } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function initializeSelect() {
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }

  function saveChanges(ref) {
    let result = {}
    const options = document.getElementById('roles').options

    for (var i = 0; i < options.length; i++) {
      let opt = options[i]
      if (opt.selected) result[opt.value] = true
      if (!opt.selected) result[opt.value] = false
    }

    ref.set({
      'displayName': document.getElementById('displayName').value,
      'email': document.getElementById('email').value,
      'roles': result,
    }, { merge: true })
      .then(() => {
        M.toast({ html: 'Profile successfully updated.', displayLength: 3000 })
        return navigateTo('/manage/users/' + router.params.id + '/view')
      })
      .catch(() => {
        return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
      })
  }
</script>

<style>
  nav {
    padding: 0px 20px 0px 20px;
  }

  .bold {
    font-weight: bold;
  }

  .no-margin {
    margin: 0px;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Edit User</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      <Doc
        path={ '/users/' + router.params.id }
        traceId={ 'UserProfileDoc' }
        maxWait={ 5000 }
        let:ref
        let:data={ user }
        on:data={ () => window.setTimeout(initializeSelect, 500) }>

        <div class="container">
          { #if userData.roles.Editor || userData.roles.Administrator }
            { #if router.params.id == userData['uid'] }
              <div class="row no-margin">
                <div class="card red">
                  <div class="card-content white-text valign-wrapper">
                    <i class="material-icons left">warning</i>
                    Warning: You are editing your own user data! Proceed with caution.
                  </div>
                </div>
              </div>
            { /if }

            <nav class="white">
              <div class="nav-wrapper">
                <div class="col s12">
                  <Link href="/manage/users/{ router.params.id }/view" class="black-text left left-align">
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

            <h3>Edit Information</h3>

            <div class="row valign-wrapper">
              <div class="col s6 bold">User UID</div>
              <div class="col s6 truncate">{ router.params.id }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Membership ID</div>
              
              { #if typeof user['membershipID'] == 'object' }
                <div class="col s6 truncate">
                  No Membership Found.
                </div>
              { :else }
                <div class="col s6 truncate">{ user['membershipID'] }</div>
              { /if }
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Display Name *</div>
              <div class="col s6 truncate">
                <input id="displayName" type="text" value={ user['displayName'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Email *</div>
              <div class="col s6 truncate">
                <input id="email" type="email" value={ user['email'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Roles</div>
              <div class="col s6">
                <select id="roles" multiple>
                  { #each roles as role }
                    { #if userData.roles.Administrator }
                      <option
                        value="{ role.id }"
                        selected="{ user['roles'][role.id] == true }">
                        
                        { role.name }
                      </option>
                    { :else }
                      <option
                        value="{ role.id }"
                        selected="{ user['roles'][role.id] == true }"
                        disabled="{ role.name == 'Administrator' }">
                        
                        { role.name }
                      </option>
                    { /if }
                  { /each }
                </select>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Erase Account</div>
              <div class="col s6">
                <button class="btn waves-orange waves-effect modal-trigger red" disabled>
                  Erase
                </button>
              </div>
            </div>

            <p>* Note: Those fields must not be blank.</p>
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