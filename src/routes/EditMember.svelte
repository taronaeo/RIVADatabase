<script>
  export let router

  import { Link, navigateTo } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'
  import { years, classes } from '../plugins/graduationInformation.js'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'
  import NoPermission from '../components/NoPermission.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function initializeSelect() {
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }

  function saveChanges(ref) {
    if (document.getElementById('fullName').value.trim() === '')
      return M.toast({ html: 'Full Name must not be empty!', displayLength: 3000 })
    
    if (document.getElementById('email').value.trim() !== '') {
      if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
        .test(document.getElementById('email').value.trim()))
          return M.toast({ html: 'Email Address must be valid!', displayLength: 3000 })
    }

    if (document.getElementById('contactNumber').value.trim() === '')
      return M.toast({ html: 'Contact Number must not be empty!', displayLength: 3000 })
    
    if (document.getElementById('nokName').value.trim() === '')
      return M.toast({ html: 'Name Of Next-Of-Kin must not be empty!', displayLength: 3000 })

    if (document.getElementById('nokRelationship').value.trim() === '')
      return M.toast({ html: 'Relationship With Next-Of-Kin must not be empty!', displayLength: 3000 })

    if (document.getElementById('nokNumber').value.trim() === '')
      return M.toast({ html: 'Contact Number Of Next-Of-Kin must not be empty!', displayLength: 3000 })

    ref.set({
      'Full Name': document.getElementById('fullName').value.trim(),
      'Gender': document.getElementById('gender').value,
      'Email': document.getElementById('email').value.trim(),
      'Current School': document.getElementById('currentSchool').value.trim(),
      'Contact Number': Number(document.getElementById('contactNumber').value),
      'Home Number': Number(document.getElementById('homeNumber').value),
      'Graduating Class': document.getElementById('graduatingClass').value,
      'Graduating Year': Number(document.getElementById('graduatingYear').value),
      'Membership Status': document.getElementById('status').value,
      'Name Of Next-Of-Kin': document.getElementById('nokName').value.trim(),
      'Relationship With Next-Of-Kin': document.getElementById('nokRelationship').value.trim(),
      'Contact Number Of Next-Of-Kin': Number(document.getElementById('nokNumber').value),
    }, { merge: true })
      .then(() => {
        M.toast({ html: 'Profile successfully updated.', displayLength: 3000 })
        return navigateTo('/manage/members/' + router.params.id + '/view')
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
  <title>RIVAlumni | Edit Membership</title>
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
          path={ '/members/' + router.params.id }
          traceId={ 'MemberDataDoc' }
          maxWait={ 5000 }
          let:ref
          let:data={ memberData }
          on:data={ () => window.setTimeout(initializeSelect, 500) }>

          <div class="container">
            <nav class="white">
              <div class="nav-wrapper">
                <div class="col s12">
                  <Link href="/manage/members/{ memberData['Membership ID'] }/view" class="black-text left left-align">
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

            <h3>Edit Membership Profile</h3>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Membership ID</div>
              <div class="col s6 truncate">{ memberData['Membership ID'] }</div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Full Name *</div>
              <div class="col s6">
                <input id="fullName" type="text" value={ memberData['Full Name'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Gender *</div>
              <div class="col s6">
                <select id="gender">
                  <option value="Male" selected={ memberData['Gender'] === 'Male' }>Male</option>
                  <option value="Female" selected={ memberData['Gender'] === 'Female' }>Female</option>
                </select>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Email</div>
              <div class="col s6">
                <input id="email" type="email" value={ memberData['Email'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Current School</div>
              <div class="col s6">
                <input id="currentSchool" type="text" value={ memberData['Current School'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Contact Number *</div>
              <div class="col s6">
                <input id="contactNumber" type="tel" value={ memberData['Contact Number'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Home Number</div>
              <div class="col s6">
                <input id="homeNumber" type="tel" value={ memberData['Home Number'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Graduating Class *</div>
              <div class="col s6">
                <!-- <input id="graduatingClass" type="text" value={ memberData['Graduating Class'] }> -->
                <select id="graduatingClass">
                  { #each classes as cls }
                    <option value={ cls.id } selected={ memberData['Graduating Class'] === cls.id }>{ cls.name }</option>
                  { /each }
                </select>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Graduating Year *</div>
              <div class="col s6">
                <!-- <input id="graduatingYear" type="number" value={ memberData['Graduating Year'] }> -->
                <select id="graduatingYear">
                  { #each years as year }
                    <option value={ year } selected={ memberData['Graduating Year'] === year }>{ year }</option>
                  { /each }
                </select>
              </div>
            </div>

            { #if userData.roles.Editor || userData.roles.Administrator }
              <div class="row valign-wrapper">
                <div class="col s6 bold">Membership Status *</div>
                <div class="col s6">
                  <select id="status">
                    <option value="ACTIVE" selected={ memberData['Membership Status'] === 'ACTIVE' }>ACTIVE</option>
                    <option value="BLACKLISTED" selected={ memberData['Membership Status'] === 'BLACKLISTED' }>BLACKLISTED</option>
                  </select>
                </div>
              </div>
            { /if }

            <p>
              * Note: Fields must not be empty!
            </p>

            <div class="divider"></div>

            <h3>Emergency Contact Details</h3>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Name Of Next-Of-Kin *</div>
              <div class="col s6">
                <input id="nokName" type="text" value={ memberData['Name Of Next-Of-Kin'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Relationship With Next-Of-Kin *</div>
              <div class="col s6">
                <input id="nokRelationship" type="text" value={ memberData['Relationship With Next-Of-Kin'] }>
              </div>
            </div>

            <div class="row valign-wrapper">
              <div class="col s6 bold">Contact Number Of Next-Of-Kin *</div>
              <div class="col s6">
                <input id="nokNumber" type="tel" value={ memberData['Contact Number Of Next-Of-Kin'] }>
              </div>
            </div>

            <p>
              * Note: Fields must not be empty!
            </p>

            <div class="divider"></div>

            <h3>Events Participated</h3>

            <p>
              <Link href="/manage/participations/add" class="red-text">
                Click here to add participations.
              </Link>
            </p>

            { #if userData.roles.Editor || userData.roles.Administrator }
              <div class="divider"></div>

              <h3>Membership Remarks</h3>

              <p>
                <Link href="/manage/members/remarks/add" class="red-text">
                  Click here to add remarks.
                </Link>
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
