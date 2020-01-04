<script>
  import { FirebaseApp, User, Doc, Collection } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
</script>

<FirebaseApp { firebase }>
  <User let:user={ user } let:auth={ auth } on:user>
    { console.log('user:', user) }
    { console.log('auth:', auth) }
  </User>
</FirebaseApp>
