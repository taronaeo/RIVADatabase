<script>
  import { Link } from 'yrv'
  import { FirebaseApp, User, Collection, Doc } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let query = ref => ref.orderBy('Event Year', 'asc').limit(5)

  function paginate(item, action) {
    if (!item) return query = ref => ref.orderBy('Event Year', 'asc').limit(5)
    if (action == 'next') return query = ref => ref.orderBy('Event Year', 'asc').startAfter(item['Event Code']).limit(5)
    if (action == 'previous') return query = ref => ref.orderBy('Event Year', 'asc').endBefore(item['Event Code']).limitToLast(5)
  }
</script>

<svelte:head>
  <title>RIVAlumni | Events</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      <Collection
        path={ '/events' }
        query={ query }
        maxWait={ 5000 }
        let:first
        let:last
        let:data={ events }>

        <div class="container">
          { #if events.length < 1 }
            { paginate() }
          { :else }
            <table class="highlight">
              <thead>
                <tr>
                  <th>Event Year</th>
                  <th>Event Code</th>
                  <th>Event Name</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                { #each events as event }
                  <tr>
                    <td>{ event['Event Year'] }</td>
                    <td>{ event['Event Code'] }</td>
                    <td>{ event['Event Name'] }</td>
                    <td>
                      <Link href="/manage/events/{ event['Event Code'] }/view" class="white-text">
                        <button class="btn waves-effect waves-light blue">
                          <i class="material-icons">remove_red_eye</i>
                        </button>
                      </Link>

                      <Link href="/manage/events/{ event['Event Code'] }/edit" class="white-text">
                        <button class="btn waves-effect waves-light amber darken-4">
                          <i class="material-icons">mode_edit</i>
                        </button>
                      </Link>
                    </td>
                  </tr>
                { /each }
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
          { /if }
        </div>

        <div slot="loading">
          <div class="container">
            <div class="progress">
              <div class="indeterminate"></div>
            </div>
          </div>
        </div>

        <div slot="fallback">
          <div class="container">
            <p>
              An error has occurred. Please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
            </p>
          </div>
        </div>
      </Collection>

      <div slot="loading">
        <div class="container">
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
        </div>
      </div>

      <div slot="fallback">
        <div class="container">
          <p>
            An error has occurred. Please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
          </p>
        </div>
      </div>
    </Doc>
  </User>
</FirebaseApp>
