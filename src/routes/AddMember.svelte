<script>
  import { navigateTo } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'
  import { classes, years } from '../plugins/graduationInformation'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function addMember(another) {
    firebase.firestore().collection('/members').add({
      'Full Name': document.getElementById('fullName').value,
      'Gender': document.getElementById('gender').value,
      'Email': document.getElementById('email').value || 'N/A',
      'Current School': document.getElementById('school').value || 'N/A',
      'Contact Number': Number(document.getElementById('contactNumber').value),
      'Home Number': Number(document.getElementById('homeNumber').value) || 0,
      'Graduating Class': document.getElementById('class').value,
      'Graduating Year': Number(document.getElementById('year').value),
      'Membership Status': document.getElementById('status').value,
      'Name Of Next-Of-Kin': document.getElementById('nokName').value,
      'Relationship With Next-Of-Kin': document.getElementById('nokRelationship').value,
      'Contact Number Of Next-Of-Kin': Number(document.getElementById('nokNumber').value),
    })
    .then(() => {
      M.toast({ html: 'Successfully added member.', displayLength: 3000 })
      
      if (another) return navigateTo('/members/add', { 'reload': true })
      return navigateTo('/members')
    })
    .catch(() => {
      return M.toast({ html: 'An error occurred.', displayLength: 3000 })
    })
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
  <title>RIVAlumni | Add Member</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'AddMember' }
      maxWait={ 5000 }
      let:data={ userData }
      on:data={ () => window.setTimeout(initializeSelect, 500) }>

      <div class="container">
        { #if userData.roles.Editor || userData.roles.Administrator }
          <h3>Personal Information</h3>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Full Name</div>
            <div class="col s6">
              <input id="fullName" type="text" placeholder="Alston Tan">
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Gender</div>
            <div class="col s6">
              <select id="gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Email</div>
            <div class="col s6">
              <input id="email" type="email" placeholder="someone@riv-alumni.com">
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Current School</div>
            <div class="col s6">
              <input id="school" type="text" placeholder="Anderson Secondary School">
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Contact Number</div>
            <div class="col s6">
              <input id="contactNumber" type="tel" placeholder="81234567">
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Home Number</div>
            <div class="col s6">
              <input id="homeNumber" type="tel" placeholder="61234567">
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Graduating Class</div>
            <div class="col s6">
              <select id="class">
                { #each classes as cls }
                  <option value="{ cls.id }">{ cls.name }</option>
                { /each }
              </select>
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Graduating Year</div>
            <div class="col s6">
              <select id="year">
                { #each years as year }
                  <option value="{ year }">{ year }</option>
                { /each }
              </select>
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Membership Status</div>
            <div class="col s6">
              <input id="status" type="text" value="ACTIVE">
            </div>
          </div>

          <div class="divider"></div>

          <h3>Emergency Contact Details</h3>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Name Of Next-Of-Kin</div>
            <div class="col s6">
              <input id="nokName" type="text" placeholder="Agnes Lee">
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Relationship With Next-Of-Kin</div>
            <div class="col s6">
              <input id="nokRelationship" type="text" placeholder="Mother">
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Contact Number Of Next-Of-Kin</div>
            <div class="col s6">
              <input id="nokNumber" type="tel" placeholder="81234567">
            </div>
          </div>

          <div class="divider"></div>

          <div class="row">
            <p>
              <button
                class="btn waves-effect waves-light green left"
                on:click={ () => addMember(false) }>
                Submit
              </button>

              <button
                class="btn waves-effect waves-light amber darken-4 right"
                on:click={ () => addMember(true) }>
                Submit another
              </button>
            </p>
          </div>
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