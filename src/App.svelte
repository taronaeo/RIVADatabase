<script>
	import { Router, Route, Link } from 'yrv'

	import Navbar from './components/Navbar.svelte'
	import Footer from './components/Footer.svelte'

	import Users from './routes/Users.svelte'
	import Events from './routes/Events.svelte'
	import Members from './routes/Members.svelte'
	import Profile from './routes/Profile.svelte'
	import Dashboard from './routes/Dashboard.svelte'
	import Participation from './routes/Participation.svelte'

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
		<Route exact path="/manage/users" component={ Users } />
		<Route exact path="/manage/users/:id/view" component={ Users } />
		<Route exact path="/manage/users/:id/edit" component={ Users } />
		<Route exact path="/manage/events" component={ Events } />
		<Route exact path="/manage/events/:id/view" component={ Events } />
		<Route exact path="/manage/events/:id/edit" component={ Events } />
		<Route exact path="/manage/participation/:id" component={ Participation } />
		<Route exact path="/manage/participation/:id/view" component={ Participation } />
		<Route exact path="/manage/participation/:id/edit" component={ Participation } />
		<Route exact path="/profile/:id" component={ Profile } />
		<Route exact path="/profile/:id/edit" component={ Profile } />
		<Route fallback component={ Dashboard } />
	</Router>

	<Footer />
</main>
