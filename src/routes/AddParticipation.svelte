<script>
  export let router

  import { Link, navigateTo } from 'yrv'
  import { FirebaseApp, Collection, User, Doc } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let fullName

  function addParticipation(another) {
    firebase.firestore().collection('/participation').doc().set({
      'Event Code': Number(router.params.id),
      'Member ID': document.getElementById('memberID').value,
      'Full Name': fullName,
      'Role': document.getElementById('role').value,
      'VIA Hours': Number(document.getElementById('viaHours').value),
    })
    .then(() => {
      M.toast({ html: 'Participation successfully added.', displayLength: 3000 })

      if (another) return navigateTo('/manage/participation/' + router.params.id + '/add', { reload: true })
      return navigateTo('/manage/events/' + router.params.id + '/view')
    })
    .catch(() => {
      return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
    })
  }

  function initializeName() {
    let select = document.getElementById('memberID')

    fullName = select.options[select.selectedIndex].innerText
  }

  function initializeChange() {
    let select = document.getElementById('memberID')
    
    select.onchange = () => {
      fullName = select.options[select.selectedIndex].innerText
    }
  }

  function initializeSelect() {
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }
</script>

<style>
  .bold {
    font-weight: bold;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Add Participation</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      maxWait={ 5000 }
      traceId={ 'addParticipationDoc' }
      let:data={ userData }>

      <Doc
        path={ '/events/' + router.params.id }
        maxWait={ 5000 }
        traceId={ 'addParticipationDoc' }
        let:data={ eventData }>

        <Collection
          path={ '/members/' }
          query={ ref => ref.orderBy('Full Name', 'asc') }
          traceId={ 'addParticipationCollection'}
          maxWait={ 5000 }
          let:data={ memberData }
          on:data={ () => window.setTimeout(initializeName, 500) }
          on:data={ () => window.setTimeout(initializeChange, 500) }
          on:data={ () => window.setTimeout(initializeSelect, 500) }>

          <div class="container">
            { #if userData.roles.Editor || userData.roles.Administrator }
              <h3>Event Roles</h3>

              { #each eventData['Roles'] as role }
                <div class="row valign-wrapper">
                  <div class="col s6 bold">{ role['Definition'] }</div>
                  <div class="col s6 truncate">{ role['ID'] }</div>
                </div>
              { /each }

              <div class="divider"></div>

              <h3>Participation Data</h3>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Code</div>
                <div class="col s6">{ router.params.id }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Full Name</div>
                <div class="col s6">
                  <select id="memberID">
                    { #each memberData as mbr }
                      <option value="{ mbr.id }">{ mbr['Full Name'] }</option>
                    { /each }
                  </select>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Role</div>
                <div class="col s6">
                  <select id="role">
                    { #each eventData['Roles'] as role }
                      <option value="{ role['ID'] }">{ role['Definition'] }</option>
                    { /each }
                  </select>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">VIA Hours</div>
                <div class="col s6">
                  <input id="viaHours" type="number" value=0>
                </div>
              </div>

              <div class="divider"></div>

              <div class="row">
                <p>
                  <button
                    class="btn waves-effect waves-light green left"
                    on:click={ () => addParticipation(false) }>
                    Submit
                  </button>

                  <button
                    class="btn waves-effect waves-light amber darken-4 right"
                    on:click={ () => addParticipation(true) }>
                    Submit another
                  </button>
                </p>
              </div>
            { :else }
              <p>
                Error 401, Unauthorized User. The user { userData.displayName } ({ userData.email }) is unauthorized to access this page.
                This error occurred because the account that you are currently signed into has not been linked to any RIVAlumni Membership Accounts.
                If you believe this is an error or require further assistance, please contact Aaron Teo (aaron.teo@riv-alumni.com)
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
