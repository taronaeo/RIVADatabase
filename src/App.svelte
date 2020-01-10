<script>
	import { Router, Route, Link } from 'yrv'

	import Navbar from './components/Navbar.svelte'
	import Footer from './components/Footer.svelte'

	import Report from './routes/Report.svelte'
	import Members from './routes/Members.svelte'
	import Profile from './routes/Profile.svelte'
	import EditProfile from './routes/EditProfile.svelte'
	import Dashboard from './routes/Dashboard.svelte'

	import Greetings from './components/Greetings.svelte'

	import firebase from 'firebase/app'
	import 'firebase/auth'

	let firebaseConfig = {
    apiKey: "AIzaSyCW-BbcmJA9NH1XWeFpWCnC6Nf__8-0Upo",
    authDomain: "rivalumniops.firebaseapp.com",
    databaseURL: "https://rivalumniops.firebaseio.com",
    projectId: "rivalumniops",
    storageBucket: "rivalumniops.appspot.com",
    messagingSenderId: "438307082557",
    appId: "1:438307082557:web:88b948de151c09bb47b554",
    measurementId: "G-5LV4ZQHWZB"
  }

	firebase.initializeApp(firebaseConfig)
</script>

<main>
	<Navbar firebase={ firebase } />

	<Greetings firebase={ firebase } />

	<Router>
		<Route exact path="/" component={ Dashboard } />
		<Route exact path="/profile" component={ Profile } />
		<Route exact path="/members" component={ Members } />
		<Route exact path="/profile/:id" component={ Profile } />
		<Route exact path="/profile/:id/edit" component={ EditProfile } />
		<Route exact path="/report" disabled={ true } component={ Report } />
		<Route fallback component={ Dashboard } />
	</Router>

	<Footer />
</main>
