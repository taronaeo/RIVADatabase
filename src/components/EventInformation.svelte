<script>
  export let id
  export let edit
  export let userData

  import { Link, navigateTo } from 'yrv'
  import { Collection, Doc } from 'sveltefire'
  import { years } from '../plugins/graduationInformation.js'

  let roles = []
  let query = ref => ref.where('Event Code', '==', Number(id)).orderBy('Full Name', 'asc').limit(10)

  function updateData(ref) {
    ref.set({
      'Event Year': Number(document.getElementById('year').value),
      'Event Name': document.getElementById('eventName').value,
      'Google Drive': document.getElementById('googleDrive').value,
      'Roles': roles,
    }, { merge: true })
    .then(() => {
      M.toast({ html: 'Event data successfully updated.', displayLength: 3000 })
      return navigateTo('/manage/events/' + id + '/view')
    })
    .catch(() => {
      return M.toast({ html: 'An error occurred.', displayLength: 3000 })
    })
  }

  function syncRoles(event) {
    const data = event.detail.data

    data['Roles'].forEach(element => {
      roles.push({ Definition: element['Definition'], ID: element['ID'] })
    })
  }

  function addRole() {
    roles.push({
      Definition: document.getElementById('newDefinition').value,
      ID: document.getElementById('newID').value,
    })

    document.getElementById('newDefinition').value = ''
    document.getElementById('newID').value = ''

    roles = roles
  }

  function removeRole(index) {
    roles.splice(index, 1)
    roles = roles
  }

  function paginate(item, action) {
    if (!item) return query = ref => ref.where('Event Code', '==', Number(id)).orderBy('Full Name', 'asc').limit(10)
    if (action == 'next') return query = ref => ref.where('Event Code', '==', Number(id)).orderBy('Full Name', 'asc').startAfter(item['Full Name']).limit(10)
    if (action == 'previous') return query = ref => ref.where('Event Code', '==', Number(id)).orderBy('Full Name', 'asc').endBefore(item['Full Name']).limitToLast(10)
  }

  function initializeButton() {
    // TODO: Needs further testing due to setTimeout()
    let elems = document.querySelectorAll('.fixed-action-btn')
    let instances = M.FloatingActionButton.init(elems, {
      hoverEnabled: false,
    })
  }

  function initializeSelect() {
    // TODO: Needs further testing due to setTimeout()
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }
</script>

<style>
  table {
    margin-bottom: 15px;
  }

  .bold {
    font-weight: bold;
  }
</style>

{ #if userData.roles.Editor || userData.roles.Administrator }
  <Doc
    path={ '/events/' + id }
    maxWait={ 5000 }
    let:ref
    let:data={ eventData }
    on:data={ () => window.setTimeout(initializeButton, 500) }
    on:data={ () => window.setTimeout(initializeSelect, 500) }
    on:data={ e => syncRoles(e) }>

    { #if edit }
      <h3>Edit Event</h3>
    { :else }
      <h3>Event Information</h3>
    { /if }

    <div class="row valign-wrapper">
      <div class="col s6 bold">Event Year</div>
      { #if edit }
        <div class="col s6">
          <select id="year">
            { #each years as year }
              <option value="{ year }" selected="{ eventData['Event Year'] == year }">{ year }</option>
            { /each }
          </select>
        </div>
      { :else }
        <div class="col s6 truncate">{ eventData['Event Year'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Event Code</div>
      <div class="col s6 truncate">{ id }</div>
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Event Name</div>
      { #if edit }
        <div class="col s6">
          <input id="eventName" type="text" value={ eventData['Event Name'] }>
        </div>
      { :else }
        <div class="col s6 truncate">{ eventData['Event Name'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Google Drive</div>
      { #if edit }
        <div class="col s6">
          <input id="googleDrive" type="url" value={ eventData['Google Drive'] }>
        </div>
      { :else }
        <div class="col s6 truncate">
          <a href="{ eventData['Google Drive'] }" class="red-text" target="_blank">
            External Link
          </a>
        </div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Event Overall In-Charge</div>
      <div class="col s6 truncate">{ eventData['Event Overall In-Charge'] }</div>
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Event Assistant In-Charge</div>
      <div class="col s6 truncate">{ eventData['Event Assistant In-Charge'] }</div>
    </div>

    <div class="divider"></div>

    <h3>Roles</h3>

    { #if edit }
      <div class="row valign-wrapper">
        <div class="col s6 bold">Definition</div>
        <div class="col s6 bold">ID</div>
        <div class="col s1 bold">Action</div>
      </div>

      <div class="row valign-wrapper">
        <div class="col s6">
          <input type="text" id="newDefinition" placeholder="Definition">
        </div>

        <div class="col s6">
          <input type="text" id="newID" placeholder="ID">
        </div>

        <div class="col s1">
          <button class="btn-flat waves-effect waves-light" on:click={ addRole }>
            <i class="material-icons">check</i>
          </button>
        </div>
      </div>
    { /if }

    { #each roles as role, i }
      <div class="row valign-wrapper">
        { #if edit }
          <div class="col s6">{ role['Definition'] }</div>
          <div class="col s6">{ role['ID'] }</div>

          <div class="col s1">
            <button class="btn-flat waves-effect waves-light" on:click={ () => removeRole(i) }>
              <i class="material-icons">close</i>
            </button>
          </div>
        { :else }
          <div class="col s6 bold">{ role['Definition'] }</div>
          <div class="col s6 truncate">{ role['ID'] }</div>
        { /if }
      </div>
    { /each }

    <div class="divider"></div>

    <h3>Participation Records</h3>

    <Collection
      path={ '/participation' }
      query={ query }
      traceId={ 'eventInformationCollection' }
      maxWait={ 5000 }
      let:data={ participation }
      let:first
      let:last>

      { #if participation.length < 1 }
        { paginate() }
      { :else }
        <table class="highlight">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Role</th>
              <th>VIA Hours</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            { #each participation as prt }
              <tr>
                <td>{ prt['Full Name'] }</td>
                <td>{ prt['Role'] }</td>
                <td>{ prt['VIA Hours'] }</td>
                <td>
                  <Link href="/manage/participation/{ prt.id }/view">
                    <button class="btn waves-effect waves-light blue">
                      <i class="material-icons">remove_red_eye</i>
                    </button>
                  </Link>

                  <Link href="/manage/participation/{ prt.id }/edit">
                    <button class="btn waves-effect waves-light amber darken-4">
                      <i class="material-icons">mode_edit</i>
                    </button>
                  </Link>
                </td>
              </tr>
            { /each }
          </tbody>
        </table>
      { /if }

      <div class="row">
        <button class="left waves-effect waves-light btn amber darken-4" on:click={ () => paginate(first, 'previous') }>Previous</button>
        <button class="right waves-effect waves-light btn amber darken-4" on:click={ () => paginate(last, 'next') }>Next</button>
      </div>
    </Collection>
    
    { #if edit }
      <div class="fixed-action-btn">
        <button class="btn-floating btn-large green pulse" on:click={ () => updateData(ref) }>
          <i class="material-icons">check</i>
        </button>
      </div>
    { :else }
      <div class="fixed-action-btn">
        <button class="btn-floating btn-large blue pulse">
          <i class="material-icons">remove_red_eye</i>
        </button>

        <ul>
          <li>
            <Link href="/manage/participation/{ id }/add">
              <button class="btn-floating green">
                <i class="material-icons">add</i>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/manage/events/{ id }/edit">
              <button class="btn-floating deep-orange">
                <i class="material-icons">mode_edit</i>
              </button>
            </Link>
          </li>
        </ul>
      </div>
    { /if }

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
{ :else }
  <p>
    Error 401, Unauthorized User. The user { userData.displayName } ({ userData.email }) is unauthorized to access this page.
    This error occurred because the account that you are currently signed into has not been linked to any RIVAlumni Membership Accounts.
    If you believe this is an error or require further assistance, please contact Aaron Teo (aaron.teo@riv-alumni.com)
  </p>
{ /if }