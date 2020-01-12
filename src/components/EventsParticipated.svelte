<script>
  export let id

  import { Collection } from 'sveltefire'
</script>

<h3>Events Participated</h3>

<!-- TODO: Add pagination -->
<Collection
  path={ 'participation' }
  query={ ref => ref.where('Member ID', '==', id) }
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
