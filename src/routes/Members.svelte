<script>
  import { FirebaseApp, User, Doc, Collection } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'

  let query = ref => ref.orderBy('Full Name', 'asc').limit(10)

  function previousPage(first) {
    query = ref => ref.orderBy('Full Name', 'asc').endBefore(first['Full Name']).limitToLast(10)
  }

  function nextPage(last) {
    query = ref => ref.orderBy('Full Name', 'asc').startAfter(last['Full Name']).limit(10)
  }
</script>

<style>
  table {
    margin-bottom: 15px;
  }

  p {
    font-weight: bold;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Members</title>
</svelte:head>

<FirebaseApp { firebase }>
  <User let:user={ user }>
    <!-- { console.log('user:', user) }
    { console.log('auth:', auth) } -->

    <Doc path={ 'users/' + user.uid } let:data={ userData }>
      <div class="container">
        { #if userData.roles.Editor }
          <Collection
            path={ 'members' }
            query={ query }
            maxWait={ 5000 }
            let:data={ members }
            let:first
            let:last>
            <table class="highlight">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                { #each members as member }
                  <tr>
                    <th>{ member['Full Name'] }</th>
                    <th>{ member['Gender'] }</th>
                    <th>
                      <button class="btn">Profile</button>
                    </th>
                  </tr>
                { /each }
                <tr></tr>
              </tbody>
            </table>

            <div slot="after">
              <div class="row">
                <span class="left waves-effect waves-light btn amber darken-4" on:click={ () => previousPage(first) }>Previous</span>
                <button class="right waves-effect waves-light btn amber darken-4" on:click={ () => nextPage(last) }>Next</button>
              </div>
            </div>

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
