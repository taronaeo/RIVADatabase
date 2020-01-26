<script>
  import { Link } from 'yrv'
</script>

<style>
  .white-text,
  .footer-copyright > .container {
    font-weight: bold;
  }
</style>

<footer class="page-footer red">
  <div class="container row">
    <div class="col l6 s12">
      <h5 class="white-text">RIVAlumni Database Protocol</h5>
      <p class="grey-text text-lighten-4">
        Administration protocol for RIVA's Central Membership Database.
        Please contact Aaron Teo (aaron.teo@riv-alumni.com) if there are any problems.
      </p>
    </div>

    <div class="col l4 offset-l2 s12">
      <h5 class="white-text">Links</h5>
      <ul>
        <li><Link class="grey-text text-lighten-3" href="/">Dashboard</Link></li>
        <li><Link class="grey-text text-lighten-3" href="/profile">Profile</Link></li>
        <li><Link class="grey-text text-lighten-3" href="/manage/members">Member List</Link></li>
      </ul>
    </div>
  </div>

  <div class="footer-copyright">
    <div class="container">
      &copy; { new Date().getFullYear() } RIVAlumni, Aaron Teo
      <a
        class="grey-text text-lighten-4 right"
        href="https://instagram.com/riv.alumni"
        target="_blank"
        rel="noreferrer noopener">Instagram</a>
    </div>
  </div>
</footer>
