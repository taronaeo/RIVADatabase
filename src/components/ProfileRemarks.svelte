<script>
  export let profile

  import { Collection } from 'sveltefire'
</script>

<h3>Profile Remarks</h3>

<!-- TODO: Add pagination -->
<Collection
  path={ 'members/' + profile['id'] + '/remarks' }
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
