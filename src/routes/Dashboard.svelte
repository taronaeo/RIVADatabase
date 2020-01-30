<script>
  import { Link } from 'yrv'
  import { FirebaseApp, User, Doc } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let membershipID

  function myParticipations(participations) {
    return participations['Member ID'] == membershipID
  }
</script>

<style>
  .bold {
    font-weight: bold !important;
  }

  .myProfile {
    font-size: 7.5rem;
    line-height: 110%
  }
</style>

<svelte:head>
  <title>RIVAlumni | Dashboard</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }
      on:data={ e => membershipID = e.detail.data.membershipID }>

      <Doc
        path={ '/events/dataAggregation' }
        traceId={ 'EventsDataDoc' }
        maxWait={ 5000 }
        let:data={ events }>

        <Doc
          path={ '/participations/dataAggregation' }
          traceId={ 'ParticipationsDataDoc' }
          maxWait={ 5000 }
          let:data={ participations }>

          <div class="container">
            <h3>About You</h3>

            <div class="row">
              <div class="col s12 m6 l6">
                <Link href="/manage/members/me">
                  <div class="card grey darken-2">
                    <div class="card-content white-text center-align">
                      <p><i class="material-icons large myProfile">person</i></p>
                      <h6 class="bold truncate">My Profile</h6>
                    </div>
                  </div>
                </Link>
              </div>

              <div class="col s12 m6 l6">
                <div class="card grey darken-2">
                  <div class="card-content white-text center-align">
                    <h1>
                      { participations['participations'].filter(myParticipations).length }
                      /
                      { events['events'].length }
                    </h1>
                    <h6 class="bold truncate">Events Completed So Far</h6>
                  </div>
                </div>
              </div>
            </div>

            { #if userData.roles.Editor || userData.roles.Administrator }
              <Doc
                path={ '/users/dataAggregation' }
                traceId={ 'UsersDataDoc' }
                maxWait={ 5000 }
                let:data={ users }>

                <Doc
                  path={ '/members/dataAggregation' }
                  traceId={ 'MembersDataDoc' }
                  maxWait={ 5000 }
                  let:data={ members }>

                  <h3>Management Panel</h3>

                  <div class="row">
                    <div class="col s12 m6 l3">
                      <div class="card grey darken-2">
                        <div class="card-content white-text center-align">
                          <p><i class="material-icons large">person</i></p>
                          <span class="card-title bold truncate">Users</span>
                          <p class="truncate">Manage Users</p>
                        </div>

                        <div class="card-action">
                          <Link href="/manage/users">
                            <i class="material-icons white-text">remove_red_eye</i>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div class="col s12 m6 l3">
                      <div class="card grey darken-2">
                        <div class="card-content white-text center-align">
                          <p><i class="material-icons large">people</i></p>
                          <span class="card-title bold truncate">Members</span>
                          <p class="truncate">Manage Members</p>
                        </div>

                        <div class="card-action">
                          <Link href="/manage/members/add">
                            <i class="material-icons white-text">add</i>
                          </Link>

                          <Link href="/manage/members">
                            <i class="material-icons white-text">remove_red_eye</i>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div class="col s12 m6 l3">
                      <div class="card grey darken-2">
                        <div class="card-content white-text center-align">
                          <p><i class="material-icons large">event</i></p>
                          <span class="card-title bold truncate">Events</span>
                          <p class="truncate">Manage Events</p>
                        </div>

                        <div class="card-action">
                          <Link href="/manage/events/create">
                            <i class="material-icons white-text">add</i>
                          </Link>

                          <Link href="/manage/events">
                            <i class="material-icons white-text">remove_red_eye</i>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div class="col s12 m6 l3">
                      <div class="card grey darken-2">
                        <div class="card-content white-text center-align">
                          <p><i class="material-icons large">access_time</i></p>
                          <span class="card-title bold truncate">Participations</span>
                          <p class="truncate">Manage Participations</p>
                        </div>

                        <div class="card-action">
                          <Link href="/manage/participation/add">
                            <i class="material-icons white-text">add</i>
                          </Link>

                          <Link href="/manage/participation">
                            <i class="material-icons white-text">remove_red_eye</i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col s12 m6 l3">
                      <div class="card grey darken-2">
                        <div class="card-content white-text center-align">
                          <h1>{ users['usersCount'] }</h1>
                          <h6 class="bold truncate">Users</h6>
                        </div>
                      </div>
                    </div>

                    <div class="col s12 m6 l3">
                      <div class="card grey darken-2">
                        <div class="card-content white-text center-align">
                          <h1>{ members['membersCount'] }</h1>
                          <h6 class="bold truncate">Members</h6>
                        </div>
                      </div>
                    </div>

                    <div class="col s12 m6 l3">
                      <div class="card grey darken-2">
                        <div class="card-content white-text center-align">
                          <h1>{ events['eventsCount'] }</h1>
                          <h6 class="bold truncate">Events</h6>
                        </div>
                      </div>
                    </div>

                    <div class="col s12 m6 l3">
                      <div class="card grey darken-2">
                        <div class="card-content white-text center-align">
                          <h1>{ participations['participationsCount'] }</h1>
                          <h6 class="bold truncate">Participations</h6>
                        </div>
                      </div>
                    </div>
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
                </Doc>

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
              </Doc>
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