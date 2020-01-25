<script>
	import { Router, Route, Link } from 'yrv'

	import Navbar from './components/Navbar.svelte'
	import Footer from './components/Footer.svelte'

	import Users from './routes/Users.svelte'
	import Events from './routes/Events.svelte'
	import Members from './routes/Members.svelte'
	import Profile from './routes/Profile.svelte'
	import ViewUser from './routes/ViewUser.svelte'
	import EditUser from './routes/EditUser.svelte'
	import Dashboard from './routes/Dashboard.svelte'
	import AddMember from './routes/AddMember.svelte'
	import ViewEvent from './routes/ViewEvent.svelte'
	import EditEvent from './routes/EditEvent.svelte'
	import CreateEvent from './routes/CreateEvent.svelte'
	import Participation from './routes/Participation.svelte'
	import AddParticipation from './routes/AddParticipation.svelte'
	import ViewParticipation from './routes/ViewParticipation.svelte'
	import EditParticipation from './routes/EditParticipation.svelte'

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
		<Route exact path="/members/add" component={ AddMember } />
		<Route exact path="/manage/users" component={ Users } />
		<Route exact path="/manage/users/:id/view" component={ ViewUser } />
		<Route exact path="/manage/users/:id/edit" component={ EditUser } />
		<Route exact path="/manage/events" component={ Events } />
		<Route exact path="/manage/events/:id" component={ ViewEvent } />
		<Route exact path="/manage/events/:id/view" component={ ViewEvent } />
		<Route exact path="/manage/events/:id/edit" component={ EditEvent } />
		<Route exact path="/manage/events/create" component={ CreateEvent } />
		<Route exact path="/manage/participation" component={ Participation } />
		<Route exact path="/manage/participation/add" component={ AddParticipation } />
		<Route exact path="/manage/participation/:id/view" component={ ViewParticipation } />
		<Route exact path="/manage/participation/:id/edit" component={ EditParticipation } />
		<Route exact path="/profile/:id" component={ Profile } />
		<Route exact path="/profile/:id/edit" component={ Profile } />
		<Route fallback component={ Dashboard } />
	</Router>

	<Footer />
</main>
