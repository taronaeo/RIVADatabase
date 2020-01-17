<script>
  export let id
  export let userData

  import { Link } from 'yrv'
  import { Collection } from 'sveltefire'
</script>

<h3>Events Participated</h3>

<!-- TODO: Add pagination -->
<Collection
  path={ 'events' }
  query={ ref => ref.where('AccessList', 'array-contains', id) }
  maxWait={ 5000 }
  let:data={ participations }>

  { #if participations.length < 1 }
    <p>
      No records found.
    </p>
  { :else }
    <table class="highlight">
      <thead>
        <tr>
          <th>Event Code</th>
          <th>Event Name</th>
          <th>VIA Hours</th>
          { #if userData.roles.Editor || userData.roles.Administrator }
            <th>Action</th>
          { /if }
        </tr>
      </thead>

      <tbody>
        { #each participations as participation }
          <tr>
            <td>{ participation['Event Code'] }</td>
            <td>{ participation['Event Name'] }</td>
            <td>{ participation['VIA Hours'] }</td>
            { #if userData.roles.Editor || userData.roles.Administrator }
              <td>
                <Link href="/manage/events/{ participation['Event Code'] }/view">
                  <button class="btn waves-effect waves-light blue">
                    <i class="material-icons">remove_red_eye</i>
                  </button>
                </Link>

                <!-- TODO: Not done yet -->
                <button class="btn waves-effect waves-light red">
                  <i class="material-icons">delete</i>
                </button>
              </td>
            { /if }
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
