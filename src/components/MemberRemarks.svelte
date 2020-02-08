<script>
  export let id

  import { Collection } from 'sveltefire'

  import Error from './Error.svelte'
</script>

<h3>Membership Remarks</h3>

<Collection
  path={ 'members/' + id + '/remarks' }
  query={ ref => ref.orderBy('Date Occurred', 'asc').limit(5) }
  traceId={ 'MemberRemarksDataCollection' }
  maxWait={ 5000 }
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
            <td>{ new Date(remark['Date Occurred'].seconds * 1000).toLocaleDateString() }</td>
            <td>{ remark['Remarks'] }</td>
            <td>{ remark['Written By'] }</td>
          </tr>
        { /each }
      </tbody>
    </table>

    <p>* Note: Only the 5 recent remarks will be shown.</p>
  { /if }

  <div slot="loading">
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  </div>

  <div slot="fallback">
    <Error />
  </div>
</Collection>
