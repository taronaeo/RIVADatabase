<script>
  export let router;
  export let view = router.path.split('/')[4] == 'view'
  export let edit = router.path.split('/')[4] == 'edit'

  import { Link } from 'yrv'
  import { FirebaseApp, User, Collection, Doc } from 'sveltefire'
  
  import EventInformation from '../components/EventInformation.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'
</script>

<svelte:head>
  <title>RIVAlumni | Events</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ 'users/' + user.uid }
      traceId={ 'events' }
      maxWait={ 5000 }
      let:data={ userData }>

      <div class="container">
        { #if userData.roles.Editor || userData.roles.Administrator }
          <Collection
            path={ '/events' }
            query={ ref => ref.orderBy('Event Year', 'asc') }
            maxWait={ 5000 }
            let:data={ events }>

            { #if view || edit }
              <EventInformation id={ router.params.id } { edit } { userData } />
            { :else if events.length < 1 }
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
        { :else }
          <p>
            Error 403, Forbidden Route. The user { userData.displayName } ({ userData.email }) is unauthorized to access this page.
            Should this be a technical error, please contact Aaron Teo (aaron.teo@riv-alumni.com) for assistance.
          </p>
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
    </Doc>
  </User>
</FirebaseApp>
