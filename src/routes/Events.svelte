<script>
  import { Link } from 'yrv'
  import { FirebaseApp, User, Collection, Doc } from 'sveltefire'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'
  import NoPermission from '../components/NoPermission.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let query = ref => ref.orderBy('Event Year', 'desc').limit(5)

  function paginate(item, action) {
    if (!item) return query = ref => ref.orderBy('Event Year', 'desc').limit(5)
    if (action == 'next') return query = ref => ref.orderBy('Event Year', 'desc').startAfter(item['Event Code']).limit(5)
    if (action == 'previous') return query = ref => ref.orderBy('Event Year', 'desc').endBefore(item['Event Code']).limitToLast(5)
  }
</script>

<style>
  i, .red-text {
    cursor: pointer;
  }
</style>

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

      { #if userData.roles.Alumni }
        <Collection
          path={ '/events' }
          query={ query }
          maxWait={ 5000 }
          let:first
          let:last
          let:data={ events }>

          <div class="container">
            { #if userData.roles.Editor || userData.roles.Administrator }
              <h3>Events Record</h3>

              { #if events.length < 1 }
                <p>
                  No other data found.
                  <i class="red-text" on:click|preventDefault|stopPropagation={ () => paginate() }>Click here to retry.</i>
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
              
              <div class="fixed-action-btn">
                <Link href="/manage/events/create">
                  <button class="btn-floating btn-large waves-effect waves-light deep-orange pulse">
                    <i class="material-icons">add</i>
                  </button>
                </Link>
              </div>
            { :else }
              <NoPermission />
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
            <Error />
          </div>
        </Collection>
      { :else }
        <NoMembership />
      { /if }

      <div slot="loading">
        <div class="container">
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
        </div>
      </div>

      <div slot="fallback">
        <Error />
      </div>
    </Doc>
  </User>
</FirebaseApp>
