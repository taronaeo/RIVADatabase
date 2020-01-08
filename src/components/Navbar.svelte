<script>
  export let firebase

  import { FirebaseApp, User } from 'sveltefire'
  import { Link } from 'yrv'

  let closeNav

  document.addEventListener('DOMContentLoaded', () => {
    let elem = document.querySelectorAll('.sidenav')
    let instances = M.Sidenav.init(elem)
  })
</script>

<style>
  div.circle {
    background-color: white;
  }
</style>

<nav>
  <div class="nav-wrapper red">
    <div class="container">
      <a href="/" class="brand-logo">RIVAlumni</a>
      <a href="#!" data-target="mobile-sidenav" class="sidenav-trigger">
        <i class="material-icons">menu</i>
      </a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link href="/">Dashboard</Link></li>
        <li><Link href="/profile">Profile</Link></li>
        <li><Link href="/report">Report Member</Link></li>
      </ul>
    </div>
  </div>
</nav>

<ul id="mobile-sidenav" class="sidenav">
  <FirebaseApp { firebase }>
    <User let:user>
      <li>
        <div class="user-view">
          <div class="background red"></div>
          <img class="circle" src="{ user.photoURL }" alt="Profile Picture">
          <span class="white-text name">{ user.displayName }</span>
          <span class="white-text email">{ user.email }</span>
        </div>
      </li>
      
      <div slot="signed-out">
        <li>
          <div class="user-view">
            <div class="background red"></div>
            <div class="circle"></div>
            <span class="white-text name">Hello Alumni!</span>
            <span class="white-text email">Please login to use our services</span>
          </div>
        </li>
      </div>
    </User>
  </FirebaseApp>
  <li><Link href="/" class="sidenav-close">Dashboard</Link></li>
  <li><Link href="/profile" class="sidenav-close">Profile</Link></li>
  <li><Link href="/report" class="sidenav-close">Report Member</Link></li>
</ul>
