<script>
  import { Link, navigateTo } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let roles = []
  let showRoles = false
  let currentEvent = null

  function selectChange() {
    showRoles = true
    currentEvent = document.getElementById('eventCode').value
  }

  function assignRoles(e) {
    if (e.detail.data) roles = e.detail.data['Roles']
  }

  function initializeSelect() {
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)

    showRoles = true
    currentEvent = document.getElementById('eventCode').value
  }

  function addParticipation() {
    let result = []
    const members = document.getElementById('names').options

    for (var i = 0; i < members.length; i++) {
      let opt = members[i]
      if (opt.selected) result.push({
        'Full Name': opt.innerText,
        'Member ID': opt.value,
      })
    }

    result.forEach(member => {
      firebase.firestore().collection('/participation').doc().set({
        'Event Code': Number(document.getElementById('eventCode').value),
        'Member ID': member['Member ID'],
        'Full Name': member['Full Name'],
        'Role': document.getElementById('role').value,
        'VIA Hours': Number(document.getElementById('viaHours').value),
      }, { merge: true })
        .catch(() => {
          return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
        })
    })

    M.toast({ html: 'Participation successfully added.', displayLength: 3000 })
    return navigateTo('/manage/events/' + document.getElementById('eventCode').value + '/view')
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
  <title>RIVAlumni | Add Participation</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      <Doc
        path={ '/events/dataAggregation' }
        traceId={ 'EventsDataDoc' }
        maxWait={ 5000 }
        let:data={ events }>

        <Doc
          path={ '/members/dataAggregation' }
          traceId={ 'MembersDataDoc' }
          maxWait={ 5000 }
          let:data={ members }
          on:data={ () => window.setTimeout(initializeSelect, 500) }>

          <div class="container">
            { #if userData.roles.Editor || userData.roles.Administrator }
              <nav class="white">
                <div class="nav-wrapper">
                  <div class="col s12">
                    <Link href="/manage/participation" class="black-text left left-align">
                      <i class="material-icons left">block</i>
                      Cancel
                    </Link>

                    <a href="#!" class="black-text right right-align modal-trigger" on:click|preventDefault|stopPropagation={ addParticipation }>
                      <i class="material-icons right">done</i>
                      Add Participation
                    </a>
                  </div>
                </div>
              </nav>

              <h3>Participation Data</h3>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Code</div>
                <div class="col s6">
                  <select id="eventCode" on:change={ selectChange }>
                    { #each events['events'] as event }
                      <option value={ event['Event Code'] }>{ event['Event Code'] } - { event['Event Name'] }</option>
                    { /each }
                  </select>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Full Name</div>
                <div class="col s6">
                  <select id="names" multiple>
                    { #each members['members'] as member }
                      <option value={ member['Membership ID'] }>{ member['Full Name'] }</option>
                    { /each }
                  </select>
                </div>
              </div>

              { #if showRoles }
                <div class="row valign-wrapper">
                  <div class="col s6 bold">Roles</div>
                  <div class="col s6">
                    <select id="role">
                      { #each roles as role }
                        <option value="{ role['ID'] }">{ role['Definition'] }</option>
                      { /each }
                    </select>
                  </div>
                </div>
              { /if }

              <div class="row valign-wrapper">
                <div class="col s6 bold">VIA Hours</div>
                <div class="col s6">
                  <input id="viaHours" type="number" value="0">
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
                    <p>
                      An error has occurred. Please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
                    </p>
                  </div>
                </Doc>
              { /if }
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
