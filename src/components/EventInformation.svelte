<script>
  export let id
  export let edit
  export let userData

  import { Link } from 'yrv'
  import { Doc } from 'sveltefire'
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
      <div class="col s6 bold">VIA Hours</div>
      { #if edit }
        <div class="col s6">
          <input id="viaHours" type="number" value={ eventData['VIA Hours']}>
        </div>
      { :else }
        <div class="col s6 truncate">{ eventData['VIA Hours'] } Hours</div>
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

    { #each eventData['Roles'] as role }
      <h5>{ role['ID'] } - { role['Definition'] }</h5>

      <table class="highlight">
        <thead>
          <tr>
            <th>Member ID</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          { #each role['Members'] as member }
            <tr>
              <td>{ member }</td>
              <td>
                <Link href="/profile/{ member }">
                  <button class="btn waves-effect waves-light blue">
                    <i class="material-icons">remove_red_eye</i>
                  </button>
                </Link>

                <!-- <Link href="/profile/{ member }/edit">
                  <button class="btn waves-effect waves-light amber darken-4">
                    <i class="material-icons">mode_edit</i>
                  </button>
                </Link> -->
              </td>
            </tr>
          { /each }
        </tbody>
      </table>
    { /each }
    
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
  </Doc>
{ :else }
  <p>
    Error 401, Unauthorized User. The user { userData.displayName } ({ userData.email }) is unauthorized to access this page.
    This error occurred because the account that you are currently signed into has not been linked to any RIVAlumni Membership Accounts.
    If you believe this is an error or require further assistance, please contact Aaron Teo (aaron.teo@riv-alumni.com)
  </p>
{ /if }