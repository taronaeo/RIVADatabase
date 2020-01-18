<script>
  export let id
  export let edit
  export let userData

  import { Link } from 'yrv'
  import { Collection, Doc } from 'sveltefire'
  import { years } from '../plugins/graduationInformation.js'

  function initializeSelect() {
    // TODO: Needs further testing due to setTimeout()
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }
</script>

<style>
  .bold {
    font-weight: bold;
  }
</style>

{ #if userData.roles.Editor || userData.roles.Administrator }
  <Doc
    path={ '/events/' + id }
    maxWait={ 5000 }
    let:data={ eventData }
    on:data={ () => window.setTimeout(initializeSelect, 500) }>

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
      { #if edit }
        <div class="col s6">
          <input id="eventCode" type="number" value={ id }>
        </div>
      { :else }
        <div class="col s6 truncate">{ id }</div>
      { /if }
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
          <a href="{ eventData['Google Drive'] }" class="btn waves-effect waves-light amber darken-4" target="_blank">Drive</a>
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

    <h3>Participation</h3>

    <Collection
      path={ '/participation' }
      query={ ref => ref.orderBy('Role', 'asc').limit(10) }
      traceId={ 'eventInformation' }
      maxWait={ 5000 }
      let:data={ participation }>

      <table class="highlight">
        <thead>
          <tr>
            <th>Role</th>
            <th>Full Name</th>
            <th>VIA Hours</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          { #each participation as prt }
            <tr>
              <td>{ prt['Role'] }</td>
              <td>{ prt['Full Name'] }</td>
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
    
    </Collection>
    
    { #if edit }
      <div class="fixed-action-btn">
        <button class="btn-floating btn-large green pulse">
          <i class="material-icons">check</i>
        </button>
      </div>
    { :else }
      <div class="fixed-action-btn">
        <Link href="/manage/events/{ id }/edit">
          <button class="btn-floating btn-large deep-orange pulse">
            <i class="material-icons">mode_edit</i>
          </button>
        </Link>
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