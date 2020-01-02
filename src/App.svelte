<script>
	import { Router, Route, Link } from 'yrv'

	import Navbar from './components/Navbar.svelte'
	import Footer from './components/Footer.svelte'

	import Report from './routes/Report.svelte'
	import Members from './routes/Members.svelte'
	import Profile from './routes/Profile.svelte'
	import Dashboard from './routes/Dashboard.svelte'
</script>

<main>
	<Navbar />

	<Router>
		<Route exact path="/" component={ Dashboard } />
		<Route exact path="/members" component={ Members } />
		<Route exact path="/profile" component={ Profile } />
		<Route exact path="/report" component={ Report } />
	</Router>

	<Footer />
</main>
