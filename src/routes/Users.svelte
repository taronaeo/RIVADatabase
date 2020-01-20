<script>
  export let router
  export let view = router.path.split('/')[4] == 'view'
  export let edit = router.path.split('/')[4] == 'edit'

  import { Link } from 'yrv'
  import { FirebaseApp, User, Collection, Doc } from 'sveltefire'

  import UserInformation from '../components/UserInformation.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'

  function resetSearch() {
    document.getElementById('search').value = ''
  }
</script>

<style>
  nav {
    margin-bottom: 15px;
  }

  tbody th {
    font-weight: normal;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Users</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ 'users/' + user.uid }
      traceId={ 'usersDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      <div class="container">
        { #if (userData.roles.Editor || userData.roles.Administrator) && (view || edit) }
          <UserInformation id={ router.params.id } { userData } { edit } />
        { :else if (userData.roles.Editor || userData.roles.Administrator) }
          <Collection
            path={ 'users' }
            query={ ref => ref.orderBy('membershipID', 'desc').limit(10) }
            traceId={ 'usersCollection' }
            maxWait={ 5000 }
            let:data={ users }>

            <!-- TODO: Add Algolia Search Systems here -->
            <nav class="amber darken-4">
              <div class="nav-wrapper">
                <div class="input-field">
                  <input id="search" type="search" placeholder="E.g. { user.displayName }">
                  <label class="label-icon" for="search"><i class="material-icons">search</i></label>
                  <i class="material-icons" on:click={ resetSearch }>close</i>
                </div>
              </div>
            </nav>

            <table class="highlighted">
              <thead>
                <tr>
                  <th>Display Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                { #each users as user }
                  <tr>
                    <th>{ user['displayName'] }</th>
                    <th>{ user['email'] }</th>
                    <th>
                      <Link href="/manage/users/{ user['id'] }/view" class="white-text">
                        <button class="btn waves-effect waves-light blue">
                          <i class="material-icons">remove_red_eye</i>
                        </button>
                      </Link>

                      <Link href="/manage/users/{ user['id'] }/edit" class="white-text">
                        <button class="btn waves-effect waves-light amber darken-4">
                          <i class="material-icons">mode_edit</i>
                        </button>
                      </Link>
                    </th>
                  </tr>
                { /each }
              </tbody>
            </table>

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
          </Collection>
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
  </User>
</FirebaseApp>
