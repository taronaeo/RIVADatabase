<script>
  export let firebase

  import { Link } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'

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
      <a href="/" class="brand-logo">
        RIVAlumni
        <b>Beta</b>
      </a>
      <a href="#!" data-target="mobile-sidenav" class="sidenav-trigger">
        <i class="material-icons">menu</i>
      </a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link href="/">Dashboard</Link></li>
        <li><Link href="/profile">Profile</Link></li>
        <li>
          <a href="#!" class="dropdown-trigger" data-target="management">
            Management
            <i class="material-icons right">arrow_drop_down</i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<ul id="management" class="dropdown-content">
  <li><Link href="/manage/users">Manage Users</Link></li>
  <li><Link href="/manage/events">Manage Events</Link></li>
  <li><Link href="/members">Manage Members</Link></li>
</ul>

<FirebaseApp { firebase }>
  <ul id="mobile-sidenav" class="sidenav">
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

    <li><Link href="/" class="sidenav-close">Dashboard</Link></li>
    <li><Link href="/profile" class="sidenav-close">Profile</Link></li>

    <User let:user>
      <Doc
        path={ 'users/' + user.uid }
        traceId={ 'Navbar' }
        maxWait={ 5000 }
        let:data={ userData }>

        { #if userData.roles.Editor || userData.roles.Administrator }
          <div class="divider"></div>

          <li><Link href="/manage/users" class="sidenav-close">Manage Users</Link></li>
          <li><Link href="/manage/events" class="sidenav-close">Manage Events</Link></li>
          <li><Link href="/members" class="sidenav-close">Manage Members</Link></li>
        { /if }

        <div slot="loading">
          <div class="container progress">
            <div class="indeterminate"></div>
          </div>
        </div>

        <div slot="fallback">
          <li><a href="#!" on:click|preventDefault="">An error has occurred.</a></li>
        </div>
      </Doc>
    </User>
  </ul>
</FirebaseApp>
