<!-- 
  This route should only be accessed by users
  that has the following roles/permissions:

  Editor or Administrator
 -->

<script>
  import { Link } from 'yrv'
  import { FirebaseApp, User, Collection, Doc } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let query = ref => ref.orderBy('displayName', 'asc').limit(10)

  function paginate(item, action) {
    if (!item) return query = ref => ref.orderBy('displayName', 'asc').limit(10)
    if (action == 'next') return query = ref => ref.orderBy('displayName', 'asc').startAfter(item['email']).limit(10)
    if (action == 'previous') return query = ref => ref.orderBy('displayName', 'asc').endBefore(item['email']).limitToLast(10)
  }
</script>

<style>
  /* For mobile compatibility */
  th {
    word-break: break-all;
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
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      <Collection
        path={ '/users' }
        query={ query }
        traceId={ 'UserDataCollection' }
        maxWait={ 5000 }
        let:first
        let:last
        let:data={ users }>

        <div class="container">
          { #if userData.roles.Editor || userData.roles.Administrator }
            { #if users.length < 1 }
              { () => window.setTimeout(paginate, 2000) }
            { :else }
              <table class="highlight">
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
            { /if }

            <div class="row">
              <p>
                <button class="left waves-effect waves-light btn amber darken-4" on:click={ () => paginate(first, 'previous') }>
                  <i class="material-icons left">navigate_before</i>
                  Prev
                </button>
                <button class="right waves-effect waves-light btn amber darken-4" on:click={ () => paginate(last, 'next') }>
                  <i class="material-icons right">navigate_next</i>
                  Next
                </button>
              </p>
            </div>
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
