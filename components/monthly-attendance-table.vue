<template>
  <section>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">
            <u>Monthly Report</u> 
          </h3>


          <v-container
            id="scroll-target"
            style="max-height: 600px"
            class="scroll-y"
          >
            <no-ssr>
              <download-excel
                class   = "btn btn-default"
                :data   = "monthly_user_attendances"
                :fields = "json_fields"
                worksheet = "My Worksheet"
                name    = "MonthlyReport.xls"
              >
                <a href="#" class="download">export to excel</a>
              </download-excel>
            </no-ssr>
            <v-data-table
              :headers="headers"
              :items="monthly_user_attendances"
              :loading="loading"
              class="elevation-1"
              hide-actions
              style="height: 500px"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.date }}</td>
                <td>{{ props.item.login_time }}</td>
                <td v-html="props.item.breaks"></td>
                <td>{{ props.item.logout_time }}</td>
              </template>
            </v-data-table>
          </v-container>
          
        </div>
      </v-card-title>
    </v-card>
  </section>
</template>

<script type="text/javascript">
import moment from 'moment'

export default {
  name: 'MonthlyAttendance',
  data: () => ({
    headers: [
      {
        text: 'Date',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Start', value: 'phone' },
      { text: 'Break', value: 'phone' },
      { text: 'End', value: 'phone' }
    ],
    loading: true,
    monthly_user_attendances: [],
    json_fields: {
      'Date': 'date',
      'Login Time': 'login_time',
      'Break Details': 'breaks',
      'Logout Time': 'logout_time'
    },
    json_meta: [
      [
        {
          'key': 'charset',
          'value': 'utf-8'
        }
      ]
    ],
    
  }),
  async created() {
    this.time_zone = this.organization.time_zone

    let month = moment().format("MM")
    let attendances = await this.$axios.get(`user_attendances?month=${month}`)
    // console.log(attendances.data.data)
    attendances.data.data.forEach((attendance) => {
      this.monthly_user_attendances.push({
        'id': attendance.id,
        'date': attendance.date,
        'login_time': attendance.login_time,
        'logout_time': attendance.logout_time,
        'breaks': (attendance.user_attendance_breaks.length ? 
          attendance.user_attendance_breaks.map((br) => {
            return '<br>' + br.break_type.name + '<br>' + br.start_time + '-' + br.end_time
          }) : '')
      })
    })

    this.loading = false
    // console.log(this.monthly_user_attendances);
  },
  methods: {
    onScroll (e) {},
    
  }
}  
</script>