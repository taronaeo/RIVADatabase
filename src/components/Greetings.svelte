<script>
  export let firebase

  import { FirebaseApp, User, Doc, Collection } from 'sveltefire'

  import 'firebase/analytics'
  import 'firebase/performance'
</script>

<style>
  h1 {
    font-weight: bold;
  }

  h5 {
    cursor: pointer;
    margin-bottom: 25px;
  }
</style>

<FirebaseApp { firebase } perf analytics>
  <User let:user={ user } let:auth={ auth } persist={ localStorage }>
    <div class="container">
      <h1 class="truncate">Greetings { user.displayName }!</h1>
      <h5 on:click="{ () => auth.signOut() }" class="red-text">
        Welcome to RIVAlumni's Database Administration Protocol. Logout?
      </h5>
    </div>

    <div slot="signed-out">
      <div class="container">
        <h1>Hello Alumni!</h1>
        <h5 on:click="{ auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()) }" class="amber-text darken-4">
          Please click here to login.
        </h5>
      </div>
    </div>
  </User>
</FirebaseApp>
