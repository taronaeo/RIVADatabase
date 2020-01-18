<script>
  export let router
  export let edit = router.path.split('/')[4] == 'edit'

  import { Link, navigateTo } from 'yrv'

  import { FirebaseApp, User, Doc } from 'sveltefire'
  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function updateData(ref) {
    ref.set({
      'Role': document.getElementById('role').value,
      'VIA Hours': Number(document.getElementById('viaHours').value),
    }, { merge: true })
    .then(() => {
      M.toast({ html: 'Participant data successfully updated.', displayLength: 3000 })
      return navigateTo('/manage/participation/' + router.params.id + '/view')
    })
    .catch(() => {
      return M.toast({ html: 'An error occurred.', displayLength: 3000 })
    })
  }

  function confirmDelete() {
    let elems = document.querySelectorAll('.modal')
    let instances = M.Modal.init(elems)
  }

  function deleteParticipation(ref) {
    ref.delete()
      .then(() => {
        M.toast({ html: 'Participation Data successfully deleted.', displayLength: 3000 })
        return navigateTo('/manage/events')
      })
      .catch(() => {
        return M.toast({ html: 'An error has occurred.', displayLength: 3000 })
      })
  }

  function initializeSelect() {
    // TODO: Needs further testing due to setTimeout()
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }
</script>

<style>
  .bold {
    font-weight: bold;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Participation</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc
      path={ '/users/' + user.uid }
      traceId={ 'participationUserDoc' }
      maxWait={ 5000 }
      let:data={ userData }>
      
      <Doc
        path={ '/participation/' + router.params.id }
        traceId={ 'participationDoc' }
        maxWait={ 5000 }
        let:ref
        let:data={ participation }>

        <div class="container">
          { #if edit }
            <h3>Edit Participation</h3>
          { :else }
            <h3>Participation Details</h3>
          { /if }

          <div class="row valign-wrapper">
            <div class="col s6 bold">Event Code</div>
            <div class="col s6 truncate">
              <Link href="/manage/events/{ participation['Event Code'] }/view" class="red-text">{ participation['Event Code'] }</Link>
            </div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Member ID</div>
            <div class="col s6 truncate">{ participation['Member ID'] }</div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Full Name</div>
            <div class="col s6 truncate">{ participation['Full Name'] }</div>
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">Role</div>
            { #if edit }
              <Doc
                path={ '/events/' + participation['Event Code'] }
                traceId={ 'participationEventDoc' }
                maxWait={ 5000 }
                let:data={ eventData }
                on:data={ () => window.setTimeout(initializeSelect, 500) }>

                <div class="col s6">
                  <select id="role">
                    { #each eventData['Roles'] as role }
                      <option
                        value="{ role['ID'] }"
                        selected={ role['ID'] == participation['Role'] }>{ role['ID'] }</option>
                    { /each }
                  </select>
                </div>
              </Doc>
            { :else }
              <div class="col s6 truncate">{ participation['Role'] }</div>
            { /if }
          </div>

          <div class="row valign-wrapper">
            <div class="col s6 bold">VIA Hours</div>
            { #if edit }
              <div class="col s6">
                <input id="viaHours" type="number" value={ participation['VIA Hours'] }>
              </div>
            { :else }
              <div class="col s6 truncate">{ participation['VIA Hours'] } Hours</div>
            { /if }
          </div>

          <div id="confirmationModal" class="modal">
            <div class="modal-content">
              <h3 class="truncate">Confirmation</h3>
              <p>Are you sure you want to delete the following data?</p>
              <p class="bold" style="word-break: break-all;">{ participation['Full Name'] } ({ participation['Member ID'] })</p>
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
            <div class="col s6 bold">Delete Participation?</div>
              <div class="col s6 truncate">
                <a
                  href="#confirmationModal"
                  class="btn waves-orange waves-effect waves-light modal-trigger red"
                  on:click|preventDefault={ confirmDelete }>
                  <i class="material-icons left">delete</i>
                  Erase
                </a>
              </div>
          </div>
        </div>

        { #if edit }
          <div class="fixed-action-btn">
            <button class="btn-floating btn-large green pulse" on:click={ () => updateData(ref) }>
              <i class="material-icons">check</i>
            </button>
          </div>
        { :else }
          <div class="fixed-action-btn">
            <Link href="/manage/participation/{ router.params.id }/edit">
              <button class="btn-floating btn-large deep-orange pulse">
                <i class="material-icons">mode_edit</i>
              </button>
            </Link>
          </div>
        { /if }
        
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
