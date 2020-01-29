<script>
  export let id
  export let userData

  import { Link } from 'yrv'
  import { Collection, Doc } from 'sveltefire'

  let query = ref => ref.where('Member ID', '==', id).orderBy('Event Code', 'desc').limit(5)

  function paginate(item, action) {
    if (!item) return query = ref => ref.where('Member ID', '==', id).orderBy('Event Code', 'desc').limit(5)
    if (action == 'next') return query = ref => ref.where('Member ID', '==', id).orderBy('Event Code', 'desc').startAfter(item['Event Code']).limit(5)
    if (action == 'previous') return query = ref => ref.where('Member ID', '==', id).orderBy('Event Code', 'desc').endBefore(item['Event Code']).limitToLast(5)
  }
</script>

<h3>Events Participated</h3>

<Collection
  path={ 'participations' }
  query={ query }
  traceId={ 'ParticipationsDataCollection' }
  maxWait={ 5000 }
  let:first
  let:last
  let:data={ participations }>

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
      { #if participations.length < 1 }
        <p>No other records found.</p>
      { :else }
        { #each participations as prt }
          <Collection
            path={ 'events' }
            query={ ref => ref.where('Event Code', '==', prt['Event Code']).orderBy('Event Year', 'desc').limit(1) }
            traceId={ 'EventsDataCollection' }
            maxWait={ 5000 }
            let:data={ events }>

            { #if events.length < 1 }
              <p>No other records found.</p>
            { :else }
              { #each events as event }
                <tr>
                  <td>{ event['Event Year'] }</td>
                  <td>{ event['Event Code'] }</td>
                  <td>{ event['Event Name'] }</td>
                  <td>{ prt['VIA Hours'] }</td>

                  { #if userData.roles.Editor || userData.roles.Administrator }
                    <td>
                      <p>
                        <Link href="/manage/events/{ event['Event Code' ]}/view">
                          <button class="btn waves-effect waves-light blue">
                            <i class="material-icons">remove_red_eye</i>
                          </button>
                        </Link>
                      </p>

                      <p>
                        <Link href="/manage/events/{ event['Event Code' ]}/edit">
                          <button class="btn waves-effect waves-light amber darken-4">
                            <i class="material-icons">mode_edit</i>
                          </button>
                        </Link>
                      </p>
                    </td>
                  { /if }
                </tr>
              { /each }
            { /if }

            <div slot="fallback">
              <p>
                An error has occurred. Please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
              </p>
            </div>
          </Collection>
        { /each }
      { /if }
    </tbody>
  </table>

  <div class="row">
    <p>
      <button class="left waves-effect waves-light btn amber darken-4" on:click={ () => paginate(first, 'previous') }>
        <i class="material-icons left">navigate_before</i>
        Prev
      </button>
      <button class="right waves-effect waves-light btn amber darken-4" on:click={ () => paginate(last, 'next') }>
        <i class="material-icons right">navigate_next</i>
        Next
      </button>
    </p>
  </div>

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