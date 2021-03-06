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

  let roles = []
  let showRoles = false
  let currentEvent = null

  function assignRoles(e) {
    if (e.detail.data) roles = e.detail.data['Roles']
  }

  function initializeSelect() {
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)

    showRoles = true
  }

  function saveChanges(ref) {
    ref.set({
      'Role': document.getElementById('role').value,
      'VIA Hours': Number(document.getElementById('viaHours').value),
      'Remarks': document.getElementById('remarks').value,
      'updatedAt': firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
      .then(() => {
        M.toast({ html: 'Participation successfully updated.', displayLength: 3000 })
        return navigateTo('/manage/participations/' + router.params.id + '/view')
      })
      .catch(() => {
        return M.toast({ html: 'An error occurred.', displayLength: 3000 })
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
</style>

<svelte:head>
  <title>RIVAlumni | Edit Participation</title>
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
          path={ '/participations/' + router.params.id }
          traceId={ 'ParticipationDataDoc' }
          maxWait={ 5000 }
          let:ref
          let:data={ prt }
          on:data={ e => currentEvent = e.detail.data['Event Code'] }>

          <Doc
            path={ '/events/dataAggregation' }
            traceId={ 'EventsDataDoc' }
            maxWait={ 5000 }
            let:data={ events }
            on:data={ () => window.setTimeout(initializeSelect, 500) }>

            <div class="container">
              { #if userData.roles.Editor || userData.roles.Administrator }
                <nav class="white">
                  <div class="nav-wrapper">
                    <div class="col s12">
                      <Link href="/manage/participations/{ router.params.id }/view" class="black-text left left-align">
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

                <h3>Edit Participation</h3>

                <div class="row valign-wrapper">
                  <div class="col s6 bold">Event Code</div>
                  <div class="col s6 truncate">
                    <Link href="/manage/events/{ prt['Event Code'] }/view" class="red-text">{ prt['Event Code'] }</Link>
                  </div>
                </div>

                <div class="row valign-wrapper">
                  <div class="col s6 bold">Member ID</div>
                  <div class="col s6 truncate">
                    <Link href="/manage/members/{ prt['Member ID'] }/view" class="red-text">{ prt['Member ID'] }</Link>
                  </div>
                </div>

                <div class="row valign-wrapper">
                  <div class="col s6 bold">Full Name</div>
                  <div class="col s6 truncate">{ prt['Full Name'] }</div>
                </div>

                { #if showRoles }
                  <div class="row valign-wrapper">
                    <div class="col s6 bold">Roles</div>
                    <div class="col s6">
                      <select id="role">
                        { #each roles as role }
                          <option value="{ role['ID'] }" selected={ role['ID'] == prt['Role'] }>{ role['Definition'] }</option>
                        { /each }
                      </select>
                    </div>
                  </div>
                { /if }

                <div class="row valign-wrapper">
                  <div class="col s6 bold">VIA Hours</div>
                  <div class="col s6">
                    <input id="viaHours" type="number" value={ prt['VIA Hours'] } min="0">
                  </div>
                </div>

                <div class="row valign-wrapper">
                  <div class="col s6 bold">Remarks</div>
                  <div class="col s6">
                    <textarea id="remarks" class="materialize-textarea">{ prt['Remarks'] }</textarea>
                  </div>
                </div>

                <div class="row valign-wrapper">
                  <div class="col s6 bold">Erase Participation</div>
                  <div class="col s6 truncate">
                    <button class="btn waves-orange waves-effect modal-trigger red" disabled>Erase</button>
                  </div>
                </div>

                { #if showRoles }
                  <div class="divider"></div>

                  <h3>Event Roles</h3>

                  <Doc
                    path={ '/events/' + currentEvent }
                    traceId={ 'EventsDataDoc' }
                    maxWait={ 5000 }
                    let:data={ eventData }
                    on:data={ () => window.setTimeout(initializeSelect, 500) }
                    on:data={ e => assignRoles(e) }>

                    { #each eventData['Roles'] as role }
                      <div class="row valign-wrapper">
                        <div class="col s6 bold">{ role['Definition'] }</div>
                        <div class="col s6">{ role['ID'] }</div>
                      </div>
                    { /each }

                    <div slot="loading">
                      <div class="progress">
                        <div class="indeterminate"></div>
                      </div>
                    </div>

                    <div slot="fallback">
                      <Error />
                    </div>
                  </Doc>
                { /if }
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
