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
    maxWait={ 5000 }
    let:ref
    let:data={ user }
    on:data={ () => window.setTimeout(initializeSelect, 500) }>
  
    { #if edit }
      <h3>Edit Profile</h3>
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
              <option
                value="{ role.id }"
                selected="{ user['roles'][role.id] == true }"
                disabled="{ userData.roles.Administrator == false }">{ role.name }</option>
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
  </Doc>
{ /if }
