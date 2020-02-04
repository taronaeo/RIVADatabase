<script>
  import { Link, navigateTo } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'
  import { classes, years } from '../plugins/graduationInformation'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'
  import NoPermission from '../components/NoPermission.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function addMember() {
    if (document.getElementById('fullName').value.trim() === '')
      return M.toast({ html: 'Full Name must not be blank!', displayLength: 3000 })

    if (document.getElementById('email').value.trim() !== '') {
      if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
        .test(document.getElementById('email').value.trim()))
          return M.toast({ html: 'Email Address must be valid!', displayLength: 3000 })
    }
    
    if (document.getElementById('contactNumber').value.trim() == '')
      return M.toast({ html: 'Contact Number must not be blank!', displayLength: 3000 })

    if (document.getElementById('nokName').value.trim() == '')
      return M.toast({ html: 'Name Of Next-Of-Kin must not be blank!', displayLength: 3000 })

    if (document.getElementById('nokRelationship').value.trim() == '')
      return M.toast({ html: 'Relationship Of Next-Of-Kin must not be blank!', displayLength: 3000 })

    if (document.getElementById('nokNumber').value.trim() == '')
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
      
      return navigateTo('/manage/members')
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
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }
      on:data={ () => window.setTimeout(initializeSelect, 500) }>

      <div class="container">
        { #if userData.roles.Alumni }
          { #if userData.roles.Administrator === false }
            <nav class="red">
              <div class="nav-wrapper">
                <div class="col s12 white-text">
                  <i class="material-icons left">warning</i>
                  Notice: You do not have permissions to add members.

                  <Link href="/manage/members" class="white-text right">
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
                  <Link href="/manage/members" class="black-text left left-align">
                    <i class="material-icons left">block</i>
                    Cancel
                  </Link>

                  <a
                    href="#!"
                    class="black-text right right-align modal-trigger"
                    on:click|preventDefault|stopPropagation={ addMember }>
                    <i class="material-icons right">done</i>
                    Add Member
                  </a>
                </div>
              </div>
            </nav>
          { /if }

          { #if userData.roles.Editor || userData.roles.Administrator }
            <h3>Personal Information</h3>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Full Name *</div>
              <div class="col s6">
                <input id="fullName" type="text" placeholder="Alston Tan">
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Gender *</div>
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
                <select id="status">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="BLACKLISTED">BLACKLISTED</option>
                </select>
              </div>
            </div>

            <p>
              * Note: Fields must not be empty!
            </p>

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

            <p>
              * Note: Fields must not be empty!
            </p>
          { :else }
            <NoPermission />
          { /if }
        { :else }
          <NoMembership />
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
  </User>
</FirebaseApp>
