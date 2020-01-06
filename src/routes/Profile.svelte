<script>
  import { FirebaseApp, User, Doc, Collection } from 'sveltefire'

  import ProfileInformation from '../components/ProfileInformation.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'
</script>

<style>
  p {
    font-weight: bold;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Profile</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc path={ 'users/' + user.uid } let:data={ userData }>
      <div class="container">
        { #if userData.roles.Alumni }
          <ProfileInformation { userData } />
        { :else }
          <p>
            Error 401, Unauthorized User. The user { userData.displayName } ({ userData.email }) is unauthorized to access this page.
            This error occurred because the account that you are currently signed into has not been linked to any RIVAlumni Membership Accounts.
            If you believe this is an error or require further assistance, please contact Aaron Teo (aaron.teo@riv-alumni.com)
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
    </Doc>
  </User>
</FirebaseApp>
