<script>
  export let id

  import { Link } from 'yrv'
  import { Collection } from 'sveltefire'

  let query = ref => ref.where('Event Code', '==', Number(id)).orderBy('Full Name', 'asc').limit(10)

  function rateLimit(func, duration) {
    setTimeout(func, duration)

    return 'Loading...'
  }

  function paginate(item, action) {
    if (!item) return query = ref => ref.where('Event Code', '==', Number(id)).orderBy('Full Name', 'asc').limit(10)
    if (action == 'next') return query = ref => ref.where('Event Code', '==', Number(id)).orderBy('Full Name', 'asc').startAfter(item['Full Name']).limit(10)
    if (action == 'previous') return query = ref => ref.where('Event Code', '==', Number(id)).orderBy('Full Name', 'asc').endBefore(item['Full Name']).limitToLast(10)
  }
</script>

<h3>Participation Records</h3>

<Collection
  path={ '/participations' }
  query={ query }
  traceId={ 'ParticipationDataCollection' }
  maxWait={ 5000 }
  let:first
  let:last
  let:data={ participations }>

  { #if participations.length < 1 }
    <p>
      { rateLimit(paginate, 1000) }
    </p>
  { :else }
    <table class="highlight">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Role</th>
          <th>VIA Hours</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        { #each participations as prt }
          <tr>
            <td>{ prt['Full Name'] }</td>
            <td>{ prt['Role'] }</td>
            <td>{ prt['VIA Hours'] }</td>
            <td>
              <p>
                <Link href="/manage/participation/{ prt.id }/view">
                  <button class="btn waves-effect waves-light blue">
                    <i class="material-icons">remove_red_eye</i>
                  </button>
                </Link>
              </p>

              <p>
                <Link href="/manage/participation/{ prt.id }/edit">
                  <button class="btn waves-effect waves-light amber darken-4">
                    <i class="material-icons">mode_edit</i>
                  </button>
                </Link>
              </p>
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
