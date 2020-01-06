<script>
  export let userData

  import { Collection } from 'sveltefire'

  import ProfileRemarks from './ProfileRemarks.svelte'
  import EventsParticipated from './EventsParticipated.svelte'
</script>

<style>
  .bold,
  p {
    font-weight: bold;
  }
</style>

<Collection
  path={ 'members' }
  query={ ref => ref.where('Email', '==', userData.email).limit(1) }
  maxWait={ 2000 }
  let:data={ profile }>

  { #if profile.length < 1 }
    <p>
      Alumni Account Not Found. This error occurred because the account that you are currently signed into has not been linked to any RIVAlumni Membership Accounts.
      If you believe this is an error or require further assistance, please contact Aaron Teo (aaron.teo@riv-alumni.com).
    </p>
  { :else }
    { #each profile as pf }
      <h3>Personal Information</h3>

      <div class="row">
        <div class="col s6 bold">Membership ID</div>
        <div class="col s6 truncate">{ pf['id'] }</div>
      </div>

      <div class="row">
        <div class="col s6 bold">User Account ID</div>
        <div class="col s6 truncate">{ userData.uid }</div>
      </div>

      <div class="row">
        <div class="col s6 bold">Full Name</div>
        <div class="col s6 truncate">{ pf['Full Name'] }</div>
      </div>

      <div class="row">
        <div class="col s6 bold">Gender</div>
        <div class="col s6 truncate">{ pf['Gender'] }</div>
      </div>

      <div class="row">
        <div class="col s6 bold">Email</div>
        <div class="col s6 truncate">{ pf['Email'] }</div>
      </div>

      <div class="row">
        <div class="col s6 bold">Contact Number</div>
        <div class="col s6 truncate">
          <a href="tel:+65{ pf['Contact Number'] }" class="red-text">{ pf['Contact Number'] }</a>
        </div>
      </div>

      <div class="row">
        <div class="col s6 bold">Home Number</div>
        <div class="col s6 truncate">
          <a href="tel:+65{ pf['Home Number'] }" class="red-text">{ pf['Home Number'] }</a>
        </div>
      </div>

      <div class="row">
        <div class="col s6 bold">Graduating Class</div>
        <div class="col s6 truncate">{ pf['Graduating Class'] }</div>
      </div>

      <div class="row">
        <div class="col s6 bold">Graduating Year</div>
        <div class="col s6 truncate">{ pf['Graduating Year'] }</div>
      </div>

      <div class="row">
        <div class="col s6 bold">Membership Status</div>
        <div class="col s6 truncate">{ pf['Membership Status'] }</div>
      </div>

      <hr />

      <h3>Emergency Contact Details</h3>

      <div class="row">
        <div class="col s6 bold">Name Of Next-Of-Kin</div>
        <div class="col s6">{ pf['Name Of Next-Of-Kin'] }</div>
      </div>

      <div class="row">
        <div class="col s6 bold">Relationship With Next-Of-Kin</div>
        <div class="col s6">{ pf['Relationship With Next-Of-Kin'] }</div>
      </div>

      <div class="row">
        <div class="col s6 bold">Contact Number Of Next-Of-Kin</div>
        <div class="col s6">
          <a href="tel:+65{ pf['Contact Number Of Next-Of-Kin'] }" class="red-text">{ pf['Contact Number Of Next-Of-Kin'] }</a>
        </div>
      </div>

      <hr />

      <EventsParticipated profile={ pf } />

      { #if userData.roles.Editor }
        <ProfileRemarks profile={ pf } />
      { /if }
    { /each }
  { /if }

  <div slot="loading">
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  </div>

  <div slot="fallback">
    <p>
      An error has occurred. Please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
    </p>
  </div>
</Collection>
