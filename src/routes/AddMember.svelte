<script>
  import { Link, navigateTo } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'
  import { classes, years } from '../plugins/graduationInformation'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function addMember() {
    if (document.getElementById('fullName').value == '')
      return M.toast({ html: 'Full Name must not be blank!', displayLength: 3000 })
    
    if (document.getElementById('contactNumber').value == '')
      return M.toast({ html: 'Contact Number must not be blank!', displayLength: 3000 })

    if (document.getElementById('nokName').value == '')
      return M.toast({ html: 'Name Of Next-Of-Kin must not be blank!', displayLength: 3000 })

    if (document.getElementById('nokRelationship').value == '')
      return M.toast({ html: 'Relationship Of Next-Of-Kin must not be blank!', displayLength: 3000 })

    if (document.getElementById('nokNumber').value == '')
      return M.toast({ html: 'Contact Number Of Next-Of-Kin must not be blank!', displayLength: 3000 })

    firebase.firestore().collection('/members').add({
      'Full Name': document.getElementById('fullName').value.trim(),
      'Gender': document.getElementById('gender').value,
      'Email': document.getElementById('email').value.trim() || 'N/A',
      'Current School': document.getElementById('school').value.trim() || 'N/A',
      'Contact Number': Number(document.getElementById('contactNumber').value),
      'Home Number': Number(document.getElementById('homeNumber').value) || 0,
      'Graduating Class': document.getElementById('class').value,
      'Graduating Year': Number(document.getElementById('year').value),
      'Membership Status': document.getElementById('status').value,
      'Name Of Next-Of-Kin': document.getElementById('nokName').value.trim(),
      'Relationship With Next-Of-Kin': document.getElementById('nokRelationship').value.trim(),
      'Contact Number Of Next-Of-Kin': Number(document.getElementById('nokNumber').value),
    })
    .then(() => {
      M.toast({ html: 'Successfully added member.', displayLength: 3000 })
      
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
  nav {
    padding: 0px 20px 0px 20px;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active  {
    box-shadow: 0 0 0 30px white inset !important;
    -webkit-box-shadow: 0 0 0 30px white inset !important;
  }

  input:-webkit-autofill {
    -webkit-text-fill-color: #F44336 !important;
  }

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
          <nav class="white">
            <div class="nav-wrapper">
              <div class="col s12">
                <Link href="/members" class="black-text left left-align">
                  <i class="material-icons left">block</i>
                  Cancel
                </Link>

                <a href="#!" class="black-text right right-align modal-trigger" on:click|preventDefault|stopPropagation={ addMember }>
                  <i class="material-icons right">done</i>
                  Create Event
                </a>
              </div>
            </div>
          </nav>

          <h3>Personal Information</h3>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Full Name *</div>
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
            <div class="col s6 bold">Contact Number *</div>
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
            <div class="col s6 bold">Graduating Class *</div>
            <div class="col s6">
              <select id="class">
                { #each classes as cls }
                  <option value="{ cls.id }">{ cls.name }</option>
                { /each }
              </select>
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Graduating Year *</div>
            <div class="col s6">
              <select id="year">
                { #each years as year }
                  <option value="{ year }">{ year }</option>
                { /each }
              </select>
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Membership Status *</div>
            <div class="col s6">
              <input id="status" type="text" value="ACTIVE">
            </div>
          </div>

          <p>* Note: Those fields must not be blank.</p>

          <div class="divider"></div>

          <h3>Emergency Contact Details</h3>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Name Of Next-Of-Kin *</div>
            <div class="col s6">
              <input id="nokName" type="text" placeholder="Agnes Lee">
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Relationship With Next-Of-Kin *</div>
            <div class="col s6">
              <input id="nokRelationship" type="text" placeholder="Mother">
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Contact Number Of Next-Of-Kin *</div>
            <div class="col s6">
              <input id="nokNumber" type="tel" placeholder="81234567">
            </div>
          </div>

          <p>* Note: Those fields must not be blank.</p>
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
