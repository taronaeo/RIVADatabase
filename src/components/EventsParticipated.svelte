<script>
  export let id
  export let userData

  import { Link } from 'yrv'
  import { Collection } from 'sveltefire'
</script>

<h3>Events Participated</h3>

<!-- TODO: Add pagination -->
<Collection
  path={ 'events' }
  query={ ref => ref.where('Access List', 'array-contains', id) }
  traceId={ 'eventsParticipated' }
  maxWait={ 5000 }
  let:data={ events }>

  { #if events.length < 1 }
    <p>
      No records found.
    </p>
  { :else }
    <table class="highlight">
      <thead>
        <tr>
          <th>Event Year</th>
          <th>Event Code</th>
          <th>Event Name</th>
          { #if userData.roles.Editor || userData.roles.Administrator }
            <th>Action</th>
          { /if }
        </tr>
      </thead>

      <tbody>
        { #each events as evt }
          <tr>
            <td>{ evt['Event Year'] }</td>
            <td>{ evt['Event Code'] }</td>
            <td>{ evt['Event Name'] }</td>
            { #if userData.roles.Editor || userData.roles.Administrator }
              <td>
                <Link href="/manage/events/{ evt['Event Code' ]}/view">
                  <button class="btn waves-effect waves-light blue">
                    <i class="material-icons">remove_red_eye</i>
                  </button>
                </Link>

                <Link href="/manage/events/{ evt['Event Code' ]}/edit">
                  <button class="btn waves-effect waves-light amber darken-4">
                    <i class="material-icons">mode_edit</i>
                  </button>
                </Link>
              </td>
            { /if }
          </tr>
        { /each }
      </tbody>
    </table>
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
