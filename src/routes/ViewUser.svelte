<!-- 
  This route should only be accessed by users
  that has the following roles/permissions:

  Editor or Administrator
 -->

<script>
  export let router

  import { Link, navigateTo } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'
  import NoPermission from '../components/NoPermission.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function confirmDelete() {
    let elems = document.querySelectorAll('.modal')
    let instances = M.Modal.init(elems)
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

  async function checkMembership(ref, email) {
    let membershipID = null

    await firebase.firestore().collection('/members').where('Email', '==', email).limit(1).get()
      .then(snapshot => {
        if (snapshot.size < 1) return M.toast({ html: 'Could not find corresponding email.', displayLength: 3000 })

        snapshot.forEach(doc => {
          if (doc.data()['Email'] == email) {
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
          return navigateTo('/manage/users/' + router.params.id + '/view')
        })
        .catch(() => {
          return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
        })
    }
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
  <title>RIVAlumni | User Information</title>
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
          path={ '/users/' + router.params.id }
          traceId={ 'UserProfileDoc' }
          maxWait={ 5000 }
          let:ref
          let:data={ user }>

          <div class="container">
            { #if userData.roles.Editor || userData.roles.Administrator }
              <nav class="white">
                <div class="nav-wrapper">
                  <div class="col s12">
                    <Link href="/manage/users" class="black-text left left-align">
                      <i class="material-icons left">arrow_back</i>
                      Go Back
                    </Link>

                    <Link href="/manage/users/{ router.params.id }/edit" class="black-text right right-align">
                      <i class="material-icons right">mode_edit</i>
                      Edit User
                    </Link>
                  </div>
                </div>
              </nav>

              <h3>User Information</h3>

              <div class="row valign-wrapper">
                <div class="col s6 bold">User UID</div>
                <div class="col s6 truncate">{ router.params.id }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Membership ID</div>
                
                { #if typeof user['membershipID'] == 'object' }
                  <div class="col s6 truncate">
                    No Membership Found.
                    <a href="#!" on:click|preventDefault|stopPropagation={ () => checkMembership(ref, user['email']) }>
                      Re-check?
                    </a>
                  </div>
                { :else }
                  <div class="col s6 truncate">{ user['membershipID'] }</div>
                { /if }
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Display Name</div>
                <div class="col s6 truncate">{ user['displayName'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Email</div>
                <div class="col s6 truncate">{ user['email'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Roles</div>
                <div class="col s6 truncate">
                  { #if user['roles'].Alumni }
                    Alumni 
                  { /if }

                  { #if user['roles'].Editor }
                    Editor 
                  { /if }

                  { #if user['roles'].Administrator }
                    Administrator 
                  { /if }
                </div>
              </div>

              <div id="confirmationModal" class="modal">
                <div class="modal-content">
                  <h3 class="truncate">Confirmation</h3>
                  <p>Are you sure you want to delete the following account?</p>
                  <p class="bold" style="word-break: break-all;">{ user['email'] } ({ router.params.id })</p>
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
                <div class="col s6 bold">Erase Account</div>
                <div class="col s6">
                  <a
                    href="#confirmationModal"
                    class="btn waves-orange waves-effect modal-trigger red"
                    class:disabled={ userData.roles.Administrator === false }
                    on:click|preventDefault={ confirmDelete }>

                    Erase
                  </a>
                </div>
              </div>
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
