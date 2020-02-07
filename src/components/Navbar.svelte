<script>
  export let firebase

  import { Link } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'

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
      <a href="/" class="brand-logo truncate">
        RIVAlumni
        <b>Beta</b>
      </a>
      <a href="#!" data-target="mobile-sidenav" class="sidenav-trigger">
        <i class="material-icons">menu</i>
      </a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link href="/">Dashboard</Link></li>
        <li><Link href="/manage/members/me">Profile</Link></li>
        <li><Link href="/request/letters/new">Request Letter</Link></li>
      </ul>
    </div>
  </div>
</nav>

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
    <li><Link href="/manage/members/me" class="sidenav-close">Profile</Link></li>
    <li><Link href="/request/letter" class="sidenav-close">Request Letter</Link></li>
  </ul>
</FirebaseApp>
