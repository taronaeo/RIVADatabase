<script>
  export let id
  export let edit
  export let userData

  import { Link, navigateTo } from 'yrv'
  import { Collection, Doc } from 'sveltefire'
  import { years, classes } from '../plugins/graduationInformation.js'

  import ProfileRemarks from './ProfileRemarks.svelte'
  import EventsParticipated from './EventsParticipated.svelte'

  function updateData(ref) {
    ref.set({
      'Full Name': document.getElementById('fullName').value,
      'Gender': document.getElementById('gender').value,
      'Email': document.getElementById('email').value,
      'Contact Number': Number(document.getElementById('contactNumber').value),
      'Home Number': Number(document.getElementById('homeNumber').value),
      'Graduating Class': document.getElementById('class').value,
      'Graduating Year': Number(document.getElementById('year').value),
      'Name Of Next-Of-Kin': document.getElementById('nokName').value,
      'Relationship With Next-Of-Kin': document.getElementById('nokRelationship').value,
      'Contact Number Of Next-Of-Kin': Number(document.getElementById('nokContact').value),
    }, { merge: true })
    .then(() => {
      M.toast({ html: 'Profile successfully updated.', displayLength: 3000 })
      return navigateTo('/profile/' + id)
    })
    .catch(() => {
      return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
    })
  }

  function initializeSelect() {
    // TODO: Needs further testing due to setTimeout()
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }
</script>

<style>
  input {
    margin-bottom: 0px;
  }

  .bold {
    font-weight: bold;
  }
</style>

{ #if userData.membershipID == id || userData.roles.Editor || userData.roles.Administrator }
  <Doc
    path={ 'members/' + id }
    maxWait={ 2000 }
    let:ref
    let:data={ profile }
    on:data={ () => window.setTimeout(initializeSelect, 500) }>
    { #if edit }
      <h3>Edit Profile</h3>
    { :else }
      <h3>Personal Information</h3>
    { /if }

    <div class="row valign-wrapper">
      <div class="col s6 bold">Membership ID</div>
      <div class="col s6 truncate">{ id }</div>
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Full Name</div>
      { #if edit }
        <div class="col s6">
          <input id="fullName" type="text" value={ profile['Full Name'] }>
        </div>
      { :else }
        <div class="col s6 truncate">{ profile['Full Name'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Gender</div>
      { #if edit }
        <div class="col s6">
          <select id="gender">
            <option value="Male" selected="{ profile['Gender'] == 'Male' }">Male</option>
            <option value="Female" selected="{ profile['Gender'] == 'Female' }">Female</option>
          </select>
        </div>
      { :else }
        <div class="col s6 truncate">{ profile['Gender'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Email</div>
      { #if edit }
      <div class="col s6">
        <input id="email" type="email" value={ profile['Email'] }>
      </div>
      { :else }
        { #if typeof profile['Email'] == 'object' }
          <div class="col s6 truncate">N/A</div>
        { :else }
          <div class="col s6 truncate">{ profile['Email'] }</div>
        { /if }
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Contact Number</div>
      { #if edit }
        <div class="col s6">
          <input id="contactNumber" type="tel" value={ profile['Contact Number'] }>
        </div>
      { :else }
        <div class="col s6 truncate">
          <a href="tel:+65{ profile['Contact Number'] }" class="red-text">{ profile['Contact Number'] }</a>
        </div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Home Number</div>
      { #if edit }
        <div class="col s6">
          <input id="homeNumber" type="tel" value={ profile['Home Number'] }>
        </div>
      { :else }
        { #if profile['Home Number'] == 0 || typeof profile['Home Number'] == 'object' }
          <div class="col s6 truncate">N/A</div>
        { :else }
          <div class="col s6 truncate">
            <a href="tel:+65{ profile['Home Number'] }" class="red-text">{ profile['Home Number'] }</a>
          </div>
        { /if }
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Graduating Class</div>
      { #if edit && (userData.roles.Editor || userData.roles.Administrator) }
        <div class="col s6">
          <select id="class">
            { #each classes as cls }
              <option value="{ cls.id }" selected="{ profile['Graduating Class'] == cls.id }">{ cls.name }</option>
            { /each }
          </select>
        </div>
      { :else }
        <div class="col s6 truncate">{ profile['Graduating Class'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Graduating Year</div>
      { #if edit && (userData.roles.Editor || userData.roles.Administrator) }
        <div class="col s6">
          <select id="year">
            { #each years as year }
              <option value="{ year }" selected="{ profile['Graduating Year'] == year }">{ year }</option>
            { /each }
          </select>
        </div>
      { :else }
        <div class="col s6 truncate">{ profile['Graduating Year'] }</div>
      { /if }
    </div>

    { #if userData.roles.Editor || userData.roles.Administrator }
      <div class="row valign-wrapper">
        <div class="col s6 bold">Membership Status</div>
        <div class="col s6 truncate">{ profile['Membership Status'] }</div>
      </div>
    { /if }

    <div class="divider"></div>

    <h3>Emergency Contact Details</h3>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Name Of Next-Of-Kin</div>
      { #if edit }
        <div class="col s6">
          <input id="nokName" type="text" value="{ profile['Name Of Next-Of-Kin'] }">
        </div>
      { :else }
        <div class="col s6">{ profile['Name Of Next-Of-Kin'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Relationship With Next-Of-Kin</div>
      { #if edit }
        <div class="col s6">
          <input id="nokRelationship" type="text" value="{ profile['Relationship With Next-Of-Kin'] }">
        </div>
      { :else }
        <div class="col s6">{ profile['Relationship With Next-Of-Kin'] }</div>
      { /if }
    </div>

    <div class="row valign-wrapper">
      <div class="col s6 bold">Contact Number Of Next-Of-Kin</div>
      { #if edit }
        <div class="col s6">
          <input id="nokContact" type="tel" value="{ profile['Contact Number Of Next-Of-Kin'] }">
        </div>
      { :else }
        <div class="col s6">
          <a href="tel:+65{ profile['Contact Number Of Next-Of-Kin'] }" class="red-text">{ profile['Contact Number Of Next-Of-Kin'] }</a>
        </div>
      { /if }
    </div>

    <div class="divider"></div>

    <EventsParticipated { id } />

    { #if userData.roles.Editor }
      <div class="divider"></div>

      <ProfileRemarks { id } />
    { /if }

    { #if edit }
      <div class="fixed-action-btn" on:click="{ () => updateData(ref) }">
        <button class="btn-floating btn-large green pulse">
          <i class="material-icons">check</i>
        </button>
      </div>
    { :else }
      <div class="fixed-action-btn">
        <Link href="/profile/{ id }/edit">
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
        No record found.
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
