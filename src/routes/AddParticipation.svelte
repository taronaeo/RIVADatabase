<script>
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

  async function addParticipation() {
    let result = []
    const members = document.getElementById('names').options

    for (var i = 0; i < members.length; i++) {
      let opt = members[i]
      if (opt.selected) result.push({
        'Full Name': opt.innerText,
        'Member ID': opt.value,
      })
    }

    const promise = new Promise((resolve, reject) => {
      result.forEach(async member => {
        await firebase.firestore().collection('/participations').doc().set({
          'Event Code': Number(document.getElementById('eventCode').value),
          'Member ID': member['Member ID'],
          'Full Name': member['Full Name'],
          'Role': document.getElementById('role').value,
          'VIA Hours': Number(document.getElementById('viaHours').value),
          'Remarks': document.getElementById('remarks').value,
          'updatedAt': firebase.firestore.FieldValue.serverTimestamp(),
          'createdAt': firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })
          .then(() => resolve())
          .catch(() => reject())
      })
    })

    return Promise.all([promise])
      .then(() => {
        M.toast({ html: 'Participation successfully added.', displayLength: 3000 })
        return navigateTo('/manage/events/' + document.getElementById('eventCode').value + '/view')
      })
      .catch(() => {
        return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
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
  <title>RIVAlumni | Add Participation</title>
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
              { #if userData.roles.Administrator === false }
                <nav class="red">
                  <div class="nav-wrapper">
                    <div class="col s12 white-text">
                      <i class="material-icons left">warning</i>
                      Notice: You do not have permissions to add participations.

                      <Link href="/manage/participations" class="white-text right">
                        <i class="material-icons right">keyboard_return</i>

                        Return
                      </Link>
                    </div>
                  </div>
                </nav>
              { :else }
                <nav class="white">
                  <div class="nav-wrapper">
                    <div class="col s12">
                      <Link href="/manage/participations" class="black-text left left-align">
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
              { /if }

              { #if userData.roles.Editor || userData.roles.Administrator }
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
                    <input id="viaHours" type="number" value="0" min="0">
                  </div>
                </div>

                <div class="row valign-wrapper">
                  <div class="col s6 bold">Remarks</div>
                  <div class="col s6">
                    <textarea id="remarks" class="materialize-textarea"></textarea>
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
