<script>
  import { FirebaseApp, Collection, User, Doc } from 'sveltefire'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'
  import NoPermission from '../components/NoPermission.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function initializeSelect() {
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }
</script>

<svelte:head>
  <title>RIVAlumni | Search Database</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }
      on:data={ () => window.setTimeout(initializeSelect, 500) }>

      <div class="container">
        { #if userData.roles.Alumni }
          <h3>Search Database</h3>

          <nav class="red">
            <div class="nav-wrapper">
              <div class="input-field">
                <input id="search" type="search" placeholder="Search keywords...">
                <label class="label-icon" for="search"><i class="material-icons">search</i></label>
                <i class="material-icons">close</i>
              </div>
            </div>
          </nav>

          { #if userData.roles.Editor || userData.roles.Administrator }

          { :else }
            <NoPermission />
          { /if }
        { :else }
          <NoMembership />
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
  </User>
</FirebaseApp>