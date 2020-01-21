<script>
  export let router

  import { Link } from 'yrv'
  import { FirebaseApp, Collection, User, Doc } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let query = ref => ref.where('Event Code', '==', Number(router.params.id)).orderBy('Full Name', 'asc').limit(10)

  function paginate(item, action) {
    if (!item) return query = ref => ref.where('Event Code', '==', Number(router.params.id)).orderBy('Full Name', 'asc').limit(10)
    if (action == 'next') return query = ref => ref.where('Event Code', '==', Number(router.params.id)).orderBy('Full Name', 'asc').startAfter(item['Full Name']).limit(10)
    if (action == 'previous') return query = ref => ref.where('Event Code', '==', Number(router.params.id)).orderBy('Full Name', 'asc').endBefore(item['Full Name']).limitToLast(10)
  }
</script>

<style>
  .bold {
    font-weight: bold;
  }

  nav {
    padding: 0px 20px 0px 20px;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Event Information</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      <Doc
        path={ '/events/' + router.params.id }
        traceId={ 'EventDataDoc' }
        maxWait={ 5000 }
        let:data={ event }>

        <Collection
          path={ '/participation' }
          query={ query }
          traceId={ 'ParticipationDataCollection' }
          maxWait={ 5000 }
          let:first
          let:last
          let:data={ participations }>

          <!-- TODO: Make collection its own component -->

            <div class="container">
            { #if userData.roles.Editor || userData.roles.Administrator }
              <nav class="white">
                <div class="nav-wrapper">
                  <div class="col s12">
                    <Link href="/manage/events" class="black-text left left-align">
                      <i class="material-icons left">arrow_back</i>
                      Go Back
                    </Link>

                    <Link href="/manage/events/{ router.params.id }/edit" class="black-text right right-align">
                      <i class="material-icons right">mode_edit</i>
                      Edit Event
                    </Link>
                  </div>
                </div>
              </nav>

              <h3>Event Information</h3>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Year</div>
                <div class="col s6 truncate">{ event['Event Year'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Code</div>
                <div class="col s6 truncate">{ router.params.id }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Name</div>
                <div class="col s6 truncate">{ event['Event Name'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Google Drive</div>
                <div class="col s6 truncate">
                  <a href={ event['Google Drive'] } class="red-text" target="_blank">
                    External Link
                  </a>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Overall In-Charge</div>
                <div class="col s6 truncate">{ event['Event Overall In-Charge'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Assistant In-Charge</div>
                <div class="col s6 truncate">{ event['Event Assistant In-Charge'] }</div>
              </div>

              <div class="divider"></div>

              <h3>Roles</h3>

              { #each event['Roles'] as role }
                <div class="row valign-wrapper">
                  <div class="col s6 bold">{ role['Definition'] }</div>
                  <div class="col s6">{ role['ID'] }</div>
                </div>
              { /each }

              <div class="divider"></div>

              <h3>Participation Records</h3>

              { #if participations.length < 1 }
                { paginate() }
              { :else }
                <table class="highlight">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Role</th>
                      <th>VIA Hours</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    { #each participations as prt }
                      <tr>
                        <td>{ prt['Full Name'] }</td>
                        <td>{ prt['Role'] }</td>
                        <td>{ prt['VIA Hours'] }</td>
                        <td>
                          <Link href="/manage/participation/{ prt.id }/view">
                            <button class="btn waves-effect waves-light blue">
                              <i class="material-icons">remove_red_eye</i>
                            </button>
                          </Link>

                          <Link href="/manage/participation/{ prt.id }/edit">
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