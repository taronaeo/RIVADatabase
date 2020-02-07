<script>
  import { FirebaseApp, User, Doc } from 'sveltefire'

  import Error from '../components/Error.svelte'
  import NoMembership from '../components/NoMembership.svelte'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'

  function initializeSelect() {
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }

  function initializeCounter() {
    let elems = document.querySelectorAll('#remarks')
    let instances = M.CharacterCounter.init(elems)
  }
</script>

<style>
  .bold {
    font-weight: bold;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Request Letter</title>
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
          path={ '/members/' + userData['membershipID'] }
          traceId={ 'MemberDataDoc' }
          maxWait={ 5000 }
          let:data={ memberData }>

          <Doc
            path={ '/participations/dataAggregation' }
            traceId={ 'ParticipationsDataDoc' }
            maxWait={ 5000 }
            let:data={ participations }
            on:data={ () => window.setTimeout(initializeSelect, 500) }
            on:data={ () => window.setTimeout(initializeCounter, 500) }>

            <div class="container">
              <h3>Request New Letter</h3>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Membership ID</div>
                <div class="col s6 truncate">{ userData['membershipID'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Full Name</div>
                <div class="col s6 truncate">{ memberData['Full Name'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Email *</div>
                <div class="col s6 truncate">{ userData['email'] }</div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Events</div>
                <div class="col s6">
                  <select id="events" multiple>
                    { #each participations['participations'] as prt }
                      { #if prt['Member ID'] === userData['membershipID'] }
                        <option value="{ prt['Event Code'] }">{ prt['Event Code'] } - { prt['Event Name'] }</option>
                      { /if }
                    { /each }
                  </select>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Request Type</div>
                <div class="col s6">
                  <select id="type">
                    <option value="via" selected>VIA Hours Letter</option>
                    <option value="excuse">Event Excuse Letter</option>
                  </select>
                </div>
              </div>

              <div class="row valign-wrapper">
                <div class="col s6 bold">Remarks</div>
                <div class="col s6">
                  <textarea id="remarks" class="materialize-textarea" placeholder="Additional comments?" data-length="300"></textarea>
                </div>
              </div>

              <p>* Note: Your letter will be emailed to that address upon approval.</p>
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
