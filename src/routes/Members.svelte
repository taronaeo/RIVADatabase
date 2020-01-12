<script>
  import { Link } from 'yrv'
  import { FirebaseApp, User, Doc, Collection } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/analytics'
  import 'firebase/firestore'
  import 'firebase/performance'

  let query = ref => ref.orderBy('Full Name', 'asc').limit(10)

  function paginate(item, action) {
    if (!item) return query = ref => ref.orderBy('Full Name', 'asc').limit(10)
    if (action == 'next') return query = ref => ref.orderBy('Full Name', 'asc').startAfter(item['Full Name']).limit(10)
    if (action == 'previous') return query = ref => ref.orderBy('Full Name', 'asc').endBefore(item['Full Name']).limitToLast(10)
  }

  function resetSearch() {
    document.getElementById('search').value = ''
  }
</script>

<style>
  tbody th {
    font-weight: normal;
  }

  nav {
    margin-bottom: 15px;
  }

  table {
    margin-bottom: 15px;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Members</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user={ user }>
    <Doc
      path={ 'users/' + user.uid }
      maxWait={ 5000 }
      let:data={ userData }>
      <div class="container">
        { #if userData.roles.Editor }
          <!-- TODO: Add Algolia Search Systems here -->
          <nav class="amber darken-4">
            <div class="nav-wrapper">
              <div class="input-field">
                <input id="search" type="search" placeholder="E.g. { userData.displayName }">
                <label class="label-icon" for="search"><i class="material-icons">search</i></label>
                <i class="material-icons" on:click={ resetSearch }>close</i>
              </div>
            </div>
          </nav>

          <Collection
            path={ 'members' }
            query={ query }
            maxWait={ 5000 }
            let:data={ members }
            let:first
            let:last>

            { #if members.length < 1 }
              { paginate() }
            { :else }
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
                        <Link href="/profile/{ member['id'] }" class="white-text">
                          <button class="btn waves-effect waves-light blue">
                            <i class="material-icons">remove_red_eye</i>
                          </button>
                        </Link>

                        <Link href="/profile/{ member['id'] }/edit" class="white-text">
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
              <span class="left waves-effect waves-light btn amber darken-4" on:click={ () => paginate(first, 'previous') }>Previous</span>
              <button class="right waves-effect waves-light btn amber darken-4" on:click={ () => paginate(last, 'next') }>Next</button>
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
