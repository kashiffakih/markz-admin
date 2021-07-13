<template>
  <section>
    <v-card>
      <v-card-title primary-title>
        <v-btn round :color="sessionTextColor"
          dark
        >
          {{sessionText}} 
        </v-btn>
        <br><br>
        <v-layout
          v-if="!loading"
        >
          <v-flex xs4 px-3>
            <v-switch
              :color="baseColor"
              v-model="disableSessionStart"
              label="Start Session"
              :disabled="disableSessionStart==true"
              @change="saveStart"
            ></v-switch>
          </v-flex>
          <v-flex xs4 px-3>
            <v-dialog
              v-model="breakDialog"
              max-width="290"
              persistent
            >
              <v-card>
                <v-card-title class="headline">Break Type?</v-card-title>

                <v-card-text>
                  <v-radio-group v-model="formBreak.break_type_id" column
                  >
                    <v-radio
                      v-for="(type, i) in break_types"
                      :key="`type${i}`"
                      :label="type.text"
                      :value="type.value"
                    ></v-radio>
                  </v-radio-group>
                </v-card-text>

                  <v-btn
                    color="green darken-1"
                    flat="flat"
                    @click="closeBreak"
                  >
                    Cancel
                  </v-btn>

                  <v-btn
                    color="green darken-1"
                    flat="flat"
                    @click="saveBreak"
                  >
                    Save
                  </v-btn>
              </v-card>
            </v-dialog>

            <v-switch
              :color="baseColor"
              v-model="disableSessionBreak"
              label="Take Break"
              @change="openBreak"
              :disabled="disableSessionBreak==true || disableSessionStart==false || disableSessionEnd==true"
            ></v-switch>
          </v-flex>
          <v-flex xs4 px-3>
            <v-switch
              :color="baseColor"
              v-model="disableSessionResume"
              label="Resume Session"
              @change="saveResume"
              :disabled="disableSessionBreak==false || disableSessionResume==true || disableSessionStart==false || disableSessionEnd==true"
            ></v-switch>
          </v-flex>
          <v-flex xs4 px-3>
            <v-switch
              :color="'red'"
              v-model="disableSessionEnd"
              label="End Session"
              @change="saveEnd"
              :disabled="disableSessionStart==false"
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-card-text>
        <h3 class="headline mb-0">
          <u>Today's Session Details</u>
          <br><br>
          <!-- <template v-if="form.logout_time==null">
            LIVE: <clock  :time="duration"></clock>
            |
            BREAK: {{ breakDuration }}
          </template>
          <template v-else>
            LIVE: {{ duration }}
            |
            BREAK: {{ breakDuration }}
          </template> -->
          <template v-if="!checkUserBreak">
            <template v-if="form.logout_time==null">
              LIVE: <clock  :time="duration"></clock>
              |
              BREAK: {{ breakDuration }}
            </template>
            <template v-else>
              LIVE: {{ duration }}
              |
              BREAK: {{ breakDuration }}
            </template>
          </template>
          <template v-else>
            <template v-if="form.logout_time==null">
              LIVE: {{ duration }}
              |
              BREAK: <clock  :time="breakDuration"></clock>
            </template>
            <template v-else>
              LIVE: {{ duration }}
              |
              BREAK: {{ breakDuration }}
            </template>
          </template>
          <br>
          <v-container
            px-0
            id="scroll-target"
            style="max-height: 400px"
            class="scroll-y"
          >
            <v-data-table
              :headers="headers"
              :items="actions"
              :loading="loading"
              class="elevation-1"
              hide-actions
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.index + 1 }}</td>
                <td>{{ props.item.action }}</td>
                <td>{{ props.item.time }}</td>
              </template>
            </v-data-table>
          </v-container>
        </h3>
      </v-card-text>
    </v-card>
  </section>
</template>

<script type="text/javascript">
import moment from 'moment'
import moment_timezone from 'moment-timezone'
import clock from '@/components/clock.vue'

export default {
  name: 'ManageSession',
  data: () => ({
    disableSessionStart: false,
    disableSessionBreak: false,
    disableSessionResume: false,
    disableSessionEnd: false,
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Action',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Time', value: 'time' }
    ],
    loading: true,
    form: {
      date: '',
      login_time: '',
      logout_time: ''
    },
    formBreak: {
      user_attendance_id: '',
      break_type_id: '',
      start_time: '',
      end_time: ''
    },
    user_attendances: {
      user_attendance_breaks: []
    },
    breakDialog: false,
    break_types: [],
    duration: '',
    breakDuration: '',
    time_zone: '',
    currentMoment: ''
  }),
  computed: {
    sessionText() {
      if(this.disableSessionEnd)
        return 'Thank you. That was worth your time. Be on time tomorrow'
      if(this.disableSessionResume)
        return 'Great!!! You resumed the session'
      if(this.disableSessionBreak)
        return 'You are on break. Come fast. Too much Work!!!'
      if(this.disableSessionStart)
        return 'Session Started';
      return 'Start your day by clicking "start session"';
    },
    sessionTextColor() {
      if(this.disableSessionEnd)
        return 'light-blue'
      if(this.disableSessionResume)
        return 'green'
      if(this.disableSessionBreak)
        return 'orange'
      if(this.disableSessionStart)
        return 'green'
      return 'blue';
    },
    actions() {
      let actions = []
      actions.push({
        'action': 'Started the session',
        'time': this.user_attendances.login_time
      })
      this.user_attendances.user_attendance_breaks.forEach(user_break => {
        actions.push({
          'action': user_break.break_type.name,
          'time'  : user_break.start_time + (user_break.end_time ? ' - ' + user_break.end_time : '')
        })
      })
      actions.push({
        'action': 'Ended the session',
        'time': this.user_attendances.logout_time
      })
      return actions
    },
    checkUserBreak() {
      this.duration = '-'
      this.breakDuration = '-'
      return this.user_attendances.user_attendance_breaks.find(user_break => user_break.end_time == null)
    },
  },
  components: {
    clock
  },
  async created() {
    
    this.time_zone = this.organization.time_zone
    // console.log(moment.utc(this.currentTimeStamp).tz(this.time_zone).format("HH:mm:ss"))

    this.currentMoment = await this.getCurrentMoment()

    await this.getUserAttendances()

    this.formBreak.user_attendance_id = this.form.id

    let types = await this.$axios.get('/break_types')
    types.data.data.forEach(type => {
      this.break_types.push({
        'text': type.name,
        'value': type.id
      })
    })

    
    // var latest_time = this.currentMoment.format("HH:mm:ss")
    // // console.log(latest_time)
    // this.duration = await this.getDuration(this.form.login_time, this.form.logout_time ? this.form.logout_time : latest_time)

    // this.getBreakDuration()
  },
  methods: {
    async saveStart() {
      console.log('Session Started');
      this.loading = true
      this.currentMoment = await this.getCurrentMoment()
      this.form.date = this.currentMoment.format("YYYY-MM-DD")
      this.form.login_time = this.currentMoment.format("HH:mm:ss")
      await this.$axios.post('/user_attendances', this.form)
      this.getUserAttendances()

      var latest_time = this.currentMoment.format("HH:mm:ss")
      this.duration = await this.getDuration(this.form.login_time, latest_time)
      this.loading = false
    },
    openBreak() {
      console.log('Open Break')
      this.loading = true
      this.formBreak = {
        user_attendance_id: '',
        break_type_id: '',
        start_time: '',
        end_time: ''
      }
      this.disableSessionResume = false
      this.breakDialog = true
      this.loading = false
    },
    closeBreak() {
      console.log('Close Break')
      this.loading = true
      this.disableSessionBreak = false
      this.breakDialog = false
      this.loading = false
    },
    async saveBreak() {
      console.log('Save Break')
      this.loading = true
      if(this.formBreak.break_type_id) {
        this.breakDialog = false
        this.currentMoment = await this.getCurrentMoment()
        this.formBreak.start_time = this.currentMoment.format("HH:mm:ss")
        this.formBreak.end_time = null
        await this.$axios.post(`/user_attendances/${this.form.id}/user_attendance_breaks`, this.formBreak)
        this.getUserAttendances()
      }
      else
        alert('No break type selected')
      this.loading = false
    },
    async saveResume() {
      console.log('Save Resume')
      this.loading = true
      this.disableSessionBreak = false
      this.currentMoment = await this.getCurrentMoment()
      this.formBreak.end_time = this.currentMoment.format("HH:mm:ss")
      await this.$axios.patch(`/user_attendances/${this.form.id}/user_attendance_breaks/${this.formBreak.id}`, this.formBreak)
      this.getUserAttendances()
      this.loading = false
    },
    async saveEnd() { 
      // If the user has not resumed the session
      // let user_break = this.checkUserBreak()
      // if(user_break) {
      //   // Latest form break whose end time is not defined
      //   this.formBreak = user_break
      //   this.saveResume()
      // }
      this.loading = true
      if(this.disableSessionEnd) {
        this.currentMoment = await this.getCurrentMoment()
        this.form.logout_time = this.currentMoment.format("HH:mm:ss")
      }
      else
        this.form.logout_time = ''
      await this.$axios.patch(`/user_attendances/${this.form.id}`, this.form)
      this.loading = false
    },
    async getUserAttendances() {
      this.loading = true
      this.currentMoment = await this.getCurrentMoment()
      this.form.date = this.currentMoment.format("YYYY-MM-DD")
      this.user_attendances = await this.$axios.get(`user_attendances?date=${this.form.date}`)
      this.user_attendances = this.user_attendances.data.data ? 
                              this.user_attendances.data.data : 
                              {
                                user_attendance_breaks: []
                              } 
      this.form = this.user_attendances
      if(this.user_attendances.login_time) {
        this.disableSessionStart = true
        if(this.user_attendances.user_attendance_breaks.length) {
          // TO check if the user is still on break
          let user_break = this.checkUserBreak
          if(user_break) {
            // Latest form break whose end time is not defined
            this.formBreak = user_break
            this.disableSessionBreak = true
          }
        }
        if(this.user_attendances.logout_time)
          this.disableSessionEnd = true
      }
      this.loading = false

      let latest_time = this.currentMoment.format("HH:mm:ss")
      this.duration = await this.getDuration(this.form.login_time, this.form.logout_time ? this.form.logout_time : latest_time)
    },
    
    async getDuration(startTime,  endTime) {
      var d = this.getMomentDuration(startTime, endTime)

      // Subtract break duration
      d.subtract(await this.getBreakDuration())

      // format a string result
      return moment.utc(+d).format('HH:mm:ss')
    },
    async getBreakDuration() {
      this.currentMoment = await this.getCurrentMoment()
      let totalBreakTime = '';
      let d = '';
      this.user_attendances.user_attendance_breaks.forEach((br, i) => {
        let endTime = br.end_time
        if(!br.end_time) {
          endTime = this.currentMoment.format("HH:mm:ss")
        }
        d = this.getMomentDuration(br.start_time, endTime)
        if(i == 0) 
          totalBreakTime = d
        
        else 
          totalBreakTime.add(d)
      })

      this.breakDuration = moment.utc(+totalBreakTime).format('HH:mm:ss')

      return totalBreakTime
    },
    getMomentDuration(startTime, endTime) {
      var start = moment.utc(startTime, "HH:mm:ss")
      var end = moment.utc(endTime, 'HH:mm:ss')
      // calculate the duration
      return moment.duration(end.diff(start));
    },
    async getCurrentMoment() {
      this.currentTimeStamp = await this.getCurrentTimeStamp()
      return moment.utc(this.currentTimeStamp).tz(this.time_zone)
    },
    async getCurrentTimeStamp() {
      let timeStampJson = await this.$axios.get('http://worldclockapi.com/api/json/utc/now')
      return timeStampJson.data.currentDateTime
    }
  }
}
</script>