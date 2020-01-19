<script>
  export let userData

  import { Link } from 'yrv'
  import { Collection } from 'sveltefire'
</script>

<style>
  table {
    margin-bottom: 15px;
  }
</style>

<h3>Events Participated</h3>

<!-- FIXME: Still needs checking, unverified success -->
<Collection
  path={ 'participation' }
  query={ ref => ref.where('Member ID', '==', userData.membershipID).orderBy('Event Code', 'desc').limit(10) }
  traceId={ 'eventsParticipated' }
  maxWait={ 5000 }
  let:data={ participation }>

  <table class="highlight">
    <thead>
      <tr>
        <th>Event Year</th>
        <th>Event Code</th>
        <th>Event Name</th>
        <th>VIA Hours</th>

        { #if userData.roles.Editor || userData.roles.Administrator }
          <th>Actions</th>
        { /if }
      </tr>
    </thead>

    <tbody>
      { #each participation as prt }
        <Collection
          path={ 'events' }
          query={ ref => ref.where('Event Code', '==', prt['Event Code']).orderBy('Event Year', 'desc').limit(10) }
          traceId={ 'eventsParticipated' }
          maxWait={ 5000 }
          let:data={ events }>

          { #if events.length < 1 }
            <p>No records found.</p>
          { :else }
            { #each events as event }
              <tr>
                <td>{ event['Event Year'] }</td>
                <td>{ event['Event Code'] }</td>
                <td>{ event['Event Name'] }</td>
                <td>{ prt['VIA Hours'] }</td>

                { #if userData.roles.Editor || userData.roles.Administrator }
                  <td>
                    <Link href="/manage/events/{ event['Event Code' ]}/view">
                      <button class="btn waves-effect waves-light blue">
                        <i class="material-icons">remove_red_eye</i>
                      </button>
                    </Link>

                    <Link href="/manage/events/{ event['Event Code' ]}/edit">
                      <button class="btn waves-effect waves-light amber darken-4">
                        <i class="material-icons">mode_edit</i>
                      </button>
                    </Link>
                  </td>
                { /if }
              </tr>
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
      { /each }
    </tbody>
  </table>

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
