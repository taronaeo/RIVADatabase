<script>
  import { FirebaseApp, User, Doc, Collection } from 'sveltefire'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/analytics'
  import 'firebase/performance'
</script>

<style>
  p {
    font-weight: bold;
  }

  .bold {
    font-weight: bold;
  }
</style>

<svelte:head>
  <title>RIVAlumni | Profile</title>
</svelte:head>

<FirebaseApp { firebase } perf analytics>
  <User let:user>
    <Doc path={ 'users/' + user.uid } let:data={ userData }>
      <div class="container">
        { #if userData.roles.Alumni }
          <Collection
            path={ 'members' }
            query={ ref => ref.where('Email', '==', userData.email).limit(1) }
            maxWait={ 2000 }
            let:data={ profile }>

            { #if profile.length < 1 }
              <p>
                Alumni Account Not Found. This error occurred because the account that you are currently signed into has not been linked to any RIVAlumni Membership Accounts.
                If you believe this is an error or require further assistance, please contact Aaron Teo (aaron.teo@riv-alumni.com).
              </p>
            { :else }
              { #each profile as pf }
                <h3>Personal Information</h3>

                <div class="row">
                  <div class="col s6 bold">Membership ID</div>
                  <div class="col s6 truncate">{ pf['id'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">User Account ID</div>
                  <div class="col s6 truncate">{ userData.uid }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Full Name</div>
                  <div class="col s6 truncate">{ pf['Full Name'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Gender</div>
                  <div class="col s6 truncate">{ pf['Gender'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Email</div>
                  <div class="col s6 truncate">{ pf['Email'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Contact Number</div>
                  <div class="col s6 truncate">{ pf['Contact Number'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Home Number</div>
                  <div class="col s6 truncate">{ pf['Home Number'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Graduating Class</div>
                  <div class="col s6 truncate">{ pf['Graduating Class'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Graduating Year</div>
                  <div class="col s6 truncate">{ pf['Graduating Year'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Membership Status</div>
                  <div class="col s6 truncate">{ pf['Membership Status'] }</div>
                </div>

                <hr />

                <h3>Emergency Contact Details</h3>

                <div class="row">
                  <div class="col s6 bold">Name Of Next-Of-Kin</div>
                  <div class="col s6">{ pf['Name Of Next-Of-Kin'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Relationship With Next-Of-Kin</div>
                  <div class="col s6">{ pf['Relationship With Next-Of-Kin'] }</div>
                </div>

                <div class="row">
                  <div class="col s6 bold">Contact Number Of Next-Of-Kin</div>
                  <div class="col s6">{ pf['Contact Number Of Next-Of-Kin'] }</div>
                </div>

                <hr />

                <!-- TODO: Add pagination -->
                <h3>Events Participated</h3>

                <Collection
                  path={ 'participation'}
                  query={ ref => ref.where('Member ID', '==', pf['id']) }
                  maxWait={ 2000 }
                  let:data={ participations }>

                  { #if participations.length < 1 }
                    <p>
                      No data found.
                    </p>
                  { :else }
                    <table class="highlight">
                      <thead>
                        <tr>
                          <th>Event Code</th>
                          <th>Event Name</th>
                          <th>VIA Hours</th>
                        </tr>
                      </thead>

                      <tbody>
                        { #each participations as participation }
                          <tr>
                            <td>{ participation['Event Code'] }</td>
                            <td>{ participation['Event Name'] }</td>
                            <td>{ participation['VIA Hours'] }</td>
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

                { #if userData.roles.Editor }
                  <!-- TODO: Add pagination -->
                  <h3>Profile Remarks</h3>

                  <Collection
                    path={ 'members/' + pf['id'] + '/remarks' }
                    query={ ref => ref.orderBy('Date Occurred', 'asc').limit(5) }
                    maxWait={ 2000 }
                    let:data={ remarks }>

                    { #if remarks.length < 1 }
                      <p>No record found.</p>
                    { :else }
                      <table class="highlight">
                        <thead>
                          <tr>
                            <th>Event Code</th>
                            <th>Date Occurred</th>
                            <th>Remarks</th>
                            <th>Written By</th>
                          </tr>
                        </thead>

                        <tbody>
                          { #each remarks as remark }
                            <tr>
                              <td>{ remark['Event Code'] }</td>
                              <td>{ remark['Date Occurred'].toDate() }</td>
                              <td>{ remark['Remarks'] }</td>
                              <td>{ remark['Written By'] }</td>
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
                { /if }
              { /each }
            { /if }

          </Collection>
        { :else }
          <p>
            Error 401, Unauthorized User. The user { userData.displayName } ({ userData.email }) is unauthorized to access this page.
            This error occurred because the account that you are currently signed into has not been linked to any RIVAlumni Membership Accounts.
            If you believe this is an error or require further assistance, please contact Aaron Teo (aaron.teo@riv-alumni.com)
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
    </Doc>
  </User>
</FirebaseApp>
