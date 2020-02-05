<!-- 
  This route should only be accessed by users
  that has the following roles/permissions:

  Editor or Administrator
 -->

<script>
  import { Link } from 'yrv'
  import { FirebaseApp, Collection, User, Doc } from 'sveltefire'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'
  import NoPermission from '../components/NoPermission.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  let query = ref => ref.orderBy('Full Name', 'asc').limit(10)

  function paginate(item, action) {
    if (!item) return query = ref => ref.orderBy('Full Name', 'asc').limit(10)
    if (action == 'next') return query = ref => ref.orderBy('Full Name', 'asc').startAfter(item['Full Name']).limit(10)
    if (action == 'previous') return query = ref => ref.orderBy('Full Name', 'asc').endBefore(item['Full Name']).limitToLast(10)
  }
</script>

<style>
  i, .red-text {
    cursor: pointer;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Participations</title>
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
          path={ '/participations' }
          query={ query }
          traceId={ 'ParticipationsDataCollection' }
          maxWait={ 5000 }
          let:first
          let:last
          let:data={ participations }>

          <div class="container">
            { #if userData.roles.Editor || userData.roles.Administrator }
              <h3>Participations Record</h3>

              { #if participations.length < 1 }
                <p>
                  No other data found.
                  <i class="red-text" on:click|preventDefault|stopPropagation={ () => paginate() }>Click here to retry.</i>
                </p>
              { :else }
                <table class="highlight">
                  <thead>
                    <tr>
                      <th>Event Code</th>
                      <th>Full Name</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    { #each participations as prt }
                      <tr>
                        <td>{ prt['Event Code'] }</td>
                        <td>{ prt['Full Name'] }</td>
                        <td>{ prt['Role'] }</td>
                        <td>
                          <Link href="/manage/participations/{ prt.id }/view" class="white-text">
                            <button class="btn waves-effect waves-light blue">
                              <i class="material-icons">remove_red_eye</i>
                            </button>
                          </Link>

                          <Link href="/manage/participations/{ prt.id }/edit" class="white-text">
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
                <Link href="/manage/participations/add">
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
