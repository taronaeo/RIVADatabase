<script>
  export let router

  import { Link, navigateTo } from 'yrv'
  import { FirebaseApp, Collection, User, Doc } from 'sveltefire'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'
  import NoPermission from '../components/NoPermission.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function confirmDelete() {
    let elems = document.querySelectorAll('.modal')
    let instances = M.Modal.init(elems)
  }

  function deleteParticipation(ref) {
    ref.delete()
      .then(() => {
        M.toast({ html: 'Participation successfully deleted.', displayLength: 3000 })
        return navigateTo('/manage/participations')
      })
      .catch(() => {
        return M.toast({ html: 'An error occurred.', displayLength: 3000 })
      })
  }
</script>

<style>
  nav {
    padding: 0px 20px 0px 20px;
  }

  .bold {
    font-weight: bold;
  }
</style>

<svelte:head>
  <title>RIVAlumni | View Participation</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'UserDataDoc' }
      maxWait={ 5000 }
      let:data={ userData }>

      { #if userData.roles.Alumni }
        <Doc
          path={ '/participations/' + router.params.id }
          traceId={ 'ParticipationDataDoc' }
          maxWait={ 5000 }
          let:ref
          let:data={ prt }>

          <div class="container">
            { #if userData.roles.Editor || userData.roles.Administrator }
              <nav class="white">
                <div class="nav-wrapper">
                  <div class="col s12">
                    <Link href="/manage/participations" class="black-text left left-align">
                      <i class="material-icons left">arrow_back</i>
                      Go Back
                    </Link>

                    <Link href="/manage/participations/{ router.params.id }/edit" class="black-text right right-align">
                      <i class="material-icons right">mode_edit</i>
                      Edit Participation
                    </Link>
                  </div>
                </div>
              </nav>

              <h3>Participation Data</h3>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Event Code</div>
                <div class="col s6 truncate">
                  <Link href="/manage/events/{ prt['Event Code'] }/view" class="red-text">{ prt['Event Code'] }</Link>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Member ID</div>
                <div class="col s6 truncate">
                  <Link href="/manage/members/{ prt['Member ID'] }/view" class="red-text">{ prt['Member ID'] }</Link>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Full Name</div>
                <div class="col s6 truncate">{ prt['Full Name'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Role</div>
                <div class="col s6 truncate">{ prt['Role'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">VIA Hours</div>
                <div class="col s6 truncate">{ prt['VIA Hours'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Remarks</div>
                { #if prt['Remarks'] == '' || typeof prt['Remarks'] == 'object' }
                  <div class="col s6 truncate">
                    <i>NO DATA</i>
                  </div>
                { :else }
                  <div class="col s6">{ prt['Remarks'] }</div>
                { /if }
              </div>

              <div id="confirmationModal" class="modal">
                <div class="modal-content">
                  <h3 class="truncate">Confirmation</h3>
                  <p>Are you sure you want to delete the following participation?</p>
                  <p class="bold" style="word-break: break-all;">{ prt['Full Name'] } ({ prt['Event Code'] })</p>
                </div>
                <div class="modal-footer">
                  <button
                    class="modal-close waves-effect waves-red btn-flat red-text"
                    on:click={ () => deleteParticipation(ref) }>
                    Confirm
                  </button>
                  <button class="modal-close waves-effect waves-green btn-flat bold green-text">Reject</button>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Erase Participation</div>
                <div class="col s6 truncate">
                  <a
                    href="#confirmationModal"
                    class="btn waves-orange waves-effect modal-trigger red"
                    class:disabled={
                      userData.roles.Administrator === false ||
                      new Date().getTime() < (prt['updatedAt'].seconds * 1000) + 120000 ||
                      new Date().getTime() < (prt['createdAt'].seconds * 1000) + 120000
                    }
                    on:click|preventDefault={ confirmDelete }>

                    Erase
                  </a>
                </div>
              </div>

              { #if userData.roles.Administrator === true &&
                    (new Date().getTime() < (prt['updatedAt'].seconds * 1000) + 120000 ||
                    new Date().getTime() < (prt['createdAt'].seconds * 1000) + 120000) }
                <div class="row valign-wrapper">
                  <code class="col s6 offset-s6 bold">Rate Limit: 2 minutes.</code>
                </div>
              { /if }
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
        </Doc>
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
