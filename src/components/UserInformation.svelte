<script>
  export let id
  export let edit
  export let userData

  import { Doc } from 'sveltefire'
  import { Link, navigateTo } from 'yrv'
  import { roles } from '../plugins/userRoles.js'

  import firebase from 'firebase/app'
  import 'firebase/firestore'

  async function checkMembership(id, ref, email) {
    let membershipID = null

    await firebase.firestore().collection('members').where('Email', '==', email).limit(1).get()
      .then(snapshot => {
        if (snapshot.size < 1) return M.toast({ html: 'Could not find corresponding email.', displayLength: 3000 })
        snapshot.forEach(doc => {
          if (email == doc.data()['Email']) {
            membershipID = doc.id
          }
        })
      })
      .catch(() => {
        return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
      })

    if (membershipID != null) {
      ref.set({
        'membershipID': membershipID,
        'roles': { 'Alumni': true }
      }, { merge: true })
      .then(() => {
        M.toast({ html: 'Profile successfully updated.', displayLength: 3000 })
        return navigateTo('/manage/users/' + id + '/view')
      })
      .catch(() => {
        return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
      })
    }
  }

  function deleteAccount(ref) {
    ref.delete()
      .then(() => {
        M.toast({ html: 'Account successfully deleted.', displayLength: 3000 })
        return navigateTo('/manage/users')
      })
      .catch(() => {
        return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
      })
  }

  function confirmDelete() {
    let elems = document.querySelectorAll('.modal')
    let instances = M.Modal.init(elems)
  }

  function updateData(ref) {
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
      return navigateTo('/manage/users/' + id + '/view')
    })
    .catch(() => {
      return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
    })
  }

  function initializeSelect() {
    // TODO: Needs further testing due to setTimeout()
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }
</script>

<style>
  .bold {
    font-weight: bold;
  }
</style>

{ #if userData.roles.Editor || userData.roles.Administrator }
  <Doc
    path={ 'users/' + id }
    traceId={ 'userInformation' }
    maxWait={ 5000 }
    let:ref
    let:data={ user }
    on:data={ () => window.setTimeout(initializeSelect, 500) }>

    { #if edit }
      <h3>Edit Profile</h3>
      { #if id == userData['uid'] }
        <div class="row">
          <div class="card red">
            <div class="card-content white-text valign-wrapper">
              <i class="material-icons left">warning</i>
              Warning: You are editing your own user data! Proceed with caution.
            </div>
          </div>
        </div>
      { /if }
    { :else }
      <h3>User Profile</h3>
    { /if }

    <div class="row valign-wrapper">
      <div class="col s6 bold">User UID</div>
      <div class="col s6 truncate">{ id }</div>
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Membership ID</div>
      { #if typeof user['membershipID'] == 'object' }
        <div class="col s6 truncate">
          No Membership Found.
          <a href="#!" on:click|preventDefault|stopPropagation={ () => checkMembership(id, ref, user['email']) }>Re-check?</a>
        </div>
      { :else }
        <div class="col s6 truncate">{ user['membershipID'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Display Name</div>
      { #if edit }
        <div class="col s6">
          <input id="displayName" type="text" value={ user['displayName'] }>
        </div>
      { :else }
        <div class="col s6 truncate">{ user['displayName'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Email</div>
      { #if edit }
        <div class="col s6">
          <input id="email" type="email" value={ user['email'] }>
        </div>
      { :else }
        <div class="col s6 truncate">{ user['email'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Roles</div>
      { #if edit }
        <div class="col s6">
          <select id="roles" multiple>
            { #each roles as role }
              { #if userData.roles.Administrator }
                <option
                  value="{ role.id }"
                  selected="{ user['roles'][role.id] == true }">{ role.name }</option>
              { :else }
                <option
                  value="{ role.id }"
                  selected="{ user['roles'][role.id] == true }"
                  disabled="{ role.name == 'Administrator' }">{ role.name }</option>
              { /if }
            { /each }
          </select>
        </div>
      { :else }
        <div class="col s6 truncate">
          <!-- FIXME: Can be better optimised -->
          { #if user['roles'].Alumni }
            Alumni,
          { /if }

          { #if user['roles'].Editor }
            Editor,
          { /if }

          { #if user['roles'].Administrator }
            Administrator
          { /if }
        </div>
      { /if }
    </div>

    { #if userData.roles.Administrator }
      <div id="confirmationModal" class="modal">
        <div class="modal-content">
          <h3 class="truncate">Confirmation</h3>
          <p>Are you sure you want to delete the following account?</p>
          <p class="bold" style="word-break: break-all;">{ user['email'] } ({ id })</p>
        </div>
        <div class="modal-footer">
          <button
            class="modal-close waves-effect waves-red btn-flat red-text"
            on:click={ () => deleteAccount(ref) }>
            Confirm
          </button>
          <button class="modal-close waves-effect waves-green btn-flat bold green-text">Reject</button>
        </div>
      </div>

      <div class="row valign-wrapper">
        <div class="col s6 bold">Delete Account</div>
        <div class="col s6">
          <a
            href="#confirmationModal"
            class="btn waves-orange waves-effect waves-light modal-trigger red"
            on:click|preventDefault={ confirmDelete }>
            Delete Account
          </a>
        </div>
      </div>
    { /if }

    { #if edit }
      <div class="fixed-action-btn">
        <button class="btn-floating btn-large green pulse" on:click={ () => updateData(ref) }>
          <i class="material-icons">check</i>
        </button>
      </div>
    { :else }
      <div class="fixed-action-btn">
        <Link href="/manage/users/{ id }/edit">
          <button class="btn-floating btn-large deep-orange pulse">
            <i class="material-icons">mode_edit</i>
          </button>
        </Link>
      </div>
    { /if }

    <div slot="loading">
      <div class="progress">
        <div class="indeterminate"></div>
      </div>
    </div>

    <div slot="fallback">
      <p>
        An error has occurred. Please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
      </p>
    </div>
  </Doc>
{ /if }
