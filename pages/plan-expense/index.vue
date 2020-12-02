<template>
  <section>
    <span class="title">Plan and Expenses</span>
    <v-layout row wrap>
      <v-flex md3>
        <v-select
          v-model="user_id"
          :items="users"
          label="Select Employee"
          @input="fetchLocations"
        ></v-select>
      </v-flex>
      <v-flex md3>
       <v-menu
          ref="dateMenu"
          :close-on-content-click="false"
          v-model="dateMenu"
          :nudge-right="40"
          :return-value.sync="date"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <v-text-field
            :error-messages="errors.date"
            slot="activator"
            v-model="date"
            label="Date"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="fetchLocations">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="locations"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.time_stamp }}</td>
        <td>{{ props.item.lat }} - {{ props.item.lng }}</td>
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.battery }}</td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">

import Vue from 'vue'

export default {
  name: 'PlanAndExpenses',
  async asyncData({$axios}) { 
    let users = await $axios.get('/users?search=all');
    users = users.data.data.map(user => ({
      'text': user.name,
      'value': user.id
    }))
    users.push({
      'text': 'admin',
      'value': 2
    })
    return {
      users: users
    }
  },
  data: () => ({
    user_id: '',
    loading: false,
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      { text: 'Time Stamp', value: 'time_stamp' },
      { text: 'Lat - Long', value: 'lat_lng' },
      { text: 'Activity Type', value: 'type' },
      { text: 'Battery', value: 'battery' },
    ],
    locations: [],
    user_locations: [],
    center: {lat: 19.0760, lng: 72.8777},
    markers: [],
    path: [],
    distance: 0,
    dateMenu: false,
    date: ''
  }),
  methods: {
    async fetchLocations() {
      if(this.date == '' || this.user_id == '')
        return;
      this.$refs.dateMenu.save(this.date)
      this.user_locations = await this.$axios.get(`/user_locations?user_id=${this.user_id}&date=${this.date}`);
      this.markers = []
      this.path = []
      this.locations = []

      console.log(this.user_locations.data.data)

      this.user_locations.data.data.forEach((data, i) => {
        if(this.IsJsonString(data['content'])) {
          let loc = JSON.parse(data['content']);
          // console.log(loc)
          if(loc.hasOwnProperty('coords')) {
            this.markers.push({
                position: {
                  lat: loc['coords']['latitude'],
                  lng: loc['coords']['longitude'],
                  time: data.updated_at
                },
              }
            )

            this.path.push({
              lat: loc['coords']['latitude'],
              lng: loc['coords']['longitude'],
            })
          }
        }
        else{
          if(data.content.coords) {
            this.locations.push({
              'time_stamp': data.updated_at,
              'lat': data.content.coords.latitude,
              'lng': data.content.coords.longitude,
              'type': data.content.activity.type,
              'battery': data.content.battery.level + ' (Charging:' + data.content.battery.is_charging + ')'
            })

            this.markers.push({
                position: {
                  lat: data.content.coords.latitude,
                  lng: data.content.coords.longitude,
                },
              }
            )

            this.path.push({
              lat: data.content.coords.latitude,
              lng: data.content.coords.longitude,
            })
          }
        }
      })

      this.center = {
        lat: this.markers[0]['position']['lat'], 
        lng: this.markers[0]['position']['lng']
      }
      this.distance = 0
      this.markers.forEach((m, i) => {
        if(i!= 0)
        {
          this.distance += this.distanceFun(this.markers[i-1]['position']['lat'], this.markers[i-1]['position']['lng'], this.markers[i]['position']['lat'], this.markers[i]['position']['lng'], 'K')
        }
      })
      // this.locations.push({
      //   'distance': this.distance
      // })
    },

    setMapMarkers(){
      for(var index = 0; index < this.markers.length; index++) {
        var point = new google.maps.LatLng(
            parseFloat(this.markers[index]['position'].lat),
            parseFloat(this.markers[index]['position'].lng)
        )

        var marker = new google.maps.Marker({
            map: this.$refs['vue-map'],
            position: point,
        })
      }
    },

    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },

    distanceFun(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
      }
      else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="M") { dist = dist * 1.609344 * 1000 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
      }
    },
  },
}
</script>