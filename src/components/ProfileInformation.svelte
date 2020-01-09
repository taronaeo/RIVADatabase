<script>
  export let id
  export let userData

  import { Collection, Doc } from 'sveltefire'

  import ProfileRemarks from './ProfileRemarks.svelte'
  import EventsParticipated from './EventsParticipated.svelte'
</script>

<style>
  .bold {
    font-weight: bold;
  }
</style>

<Doc path={ 'members/' + id } maxWait={ 2000 } let:data={ profile }>
  <h3>Personal Information</h3>

  <div class="row">
    <div class="col s6 bold">Membership ID</div>
    <div class="col s6 truncate">{ id }</div>
  </div>

  <div class="row">
    <div class="col s6 bold">Full Name</div>
    <div class="col s6 truncate">{ profile['Full Name'] }</div>
  </div>

  <div class="row">
    <div class="col s6 bold">Gender</div>
    <div class="col s6 truncate">{ profile['Gender'] }</div>
  </div>

  <div class="row">
    <div class="col s6 bold">Email</div>
    { #if typeof profile['Email'] == 'object' }
      <div class="col s6 truncate">N/A</div>
    { :else }
      <div class="col s6 truncate">{ profile['Email'] }</div>
    { /if }
  </div>

  <div class="row">
    <div class="col s6 bold">Contact Number</div>
    <div class="col s6 truncate">
      <a href="tel:+65{ profile['Contact Number'] }" class="red-text">{ profile['Contact Number'] }</a>
    </div>
  </div>

  <div class="row">
    <div class="col s6 bold">Home Number</div>
    { #if typeof profile['Home Number'] == 'object' }
      <div class="col s6 truncate">N/A</div>
    { :else }
      <div class="col s6 truncate">
        <a href="tel:+65{ profile['Home Number'] }" class="red-text">{ profile['Home Number'] }</a>
      </div>
    { /if }
  </div>

  <div class="row">
    <div class="col s6 bold">Graduating Class</div>
    <div class="col s6 truncate">{ profile['Graduating Class'] }</div>
  </div>

  <div class="row">
    <div class="col s6 bold">Graduating Year</div>
    <div class="col s6 truncate">{ profile['Graduating Year'] }</div>
  </div>

  <div class="row">
    <div class="col s6 bold">Membership Status</div>
    <div class="col s6 truncate">{ profile['Membership Status'] }</div>
  </div>

  <hr />

  <h3>Emergency Contact Details</h3>

  <div class="row">
    <div class="col s6 bold">Name Of Next-Of-Kin</div>
    <div class="col s6">{ profile['Name Of Next-Of-Kin'] }</div>
  </div>

  <div class="row">
    <div class="col s6 bold">Relationship With Next-Of-Kin</div>
    <div class="col s6">{ profile['Relationship With Next-Of-Kin'] }</div>
  </div>

  <div class="row">
    <div class="col s6 bold">Contact Number Of Next-Of-Kin</div>
    <div class="col s6">
      <a href="tel:+65{ profile['Contact Number Of Next-Of-Kin'] }" class="red-text">{ profile['Contact Number Of Next-Of-Kin'] }</a>
    </div>
  </div>

  <hr />

  <EventsParticipated { id } />

  <hr />

  { #if userData.roles.Editor }
    <ProfileRemarks { id } />
  { /if }

  <div slot="loading">
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  </div>

  <div slot="fallback">
    <p>
      No record found.
    </p>
  </div>
</Doc>
