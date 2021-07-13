<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Dashboard</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Dashboard</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <!-- Small boxes (Stat box) -->
          <div class="row">
            <div class="col-lg-3 col-6">
              <!-- small box -->
              <div class="small-box bg-info">
                <div class="inner">
                  <h3>{{ count.inspectors }}</h3>

                  <p>Inspectors</p>
                </div>
                <div class="icon">
                  <i class="fas fa-users"></i>
                </div>
                <nuxt-link :to="`/organizations/${this.organization.value}/employees`" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></nuxt-link>
              </div>
            </div>
            <!-- ./col -->
            <div class="col-lg-3 col-6">
              <!-- small box -->
              <div class="small-box bg-success">
                <div class="inner">
                  <h3>{{ count.jobs }}</h3>

                  <p>Jobs</p>
                </div>
                <div class="icon">
                  <i class="fas fa-cogs"></i>
                </div>
                <nuxt-link :to="`/organizations/${this.organization.value}/jobs`" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></nuxt-link>
              </div>
            </div>
            <!-- ./col -->
            <div class="col-lg-3 col-6">
              <!-- small box -->
              <div class="small-box bg-warning">
                <div class="inner">
                  <h3>{{ count.policies }}</h3>

                  <p>Policies</p>
                </div>
                <div class="icon">
                  <i class="fas fa-vote-yea"></i>
                </div>
                <nuxt-link :to="`/organizations/${this.organization.value}/policies`" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></nuxt-link>
              </div>
            </div>
            <!-- ./col -->
            <div class="col-lg-3 col-6">
              <!-- small box -->
              <div class="small-box bg-danger">
                <div class="inner">
                  <h3>{{ count.forms }}</h3>

                  <p>Forms</p>
                </div>
                <div class="icon">
                  <i class="fas fa-sticky-note"></i>
                </div>
                <nuxt-link :to="`/organizations/${this.organization.value}/forms`" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></nuxt-link>
              </div>
            </div>
            <!-- ./col -->
          </div>
          <!-- /.row -->
        </div>

        <div class="container-fluid">
          <div class="row justify-content-center">
            <!-- left column -->
            <div class="col-md-12">
              <GmapMap
                :center="{lat:10, lng:10}"
                :zoom="8"
                map-type-id="terrain"
                style="width: 100%; height: 500px"
              >
                <GmapMarker
                  v-for="(m, index) in markers1"
                  :key="`m${index}`"
                  :position="m.position"
                  :clickable="true"
                  :draggable="true"
                  @click="center=m.position"
                  :icon="'marker1.png'"
                />
                <GmapMarker
                  v-for="(m, index) in markers2"
                  :key="`index${index}`"
                  :position="m.position"
                  :clickable="true"
                  :draggable="true"
                  @click="center=m.position"
                  :icon="'marker2.png'"
                />
              </GmapMap>
            </div>
            <!--/.col (left) -->
          </div>
          <!-- /.row -->
        </div>
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <!-- Main content -->
      <section class="content">

      </section>
      <!-- /.content -->

  </section>
</template>

<script>

export default {
  name: 'Dashboard', 
  data: () => ({
    count: {},
    markers1: [
      {
        position: {
          lat: 10.0,
          lng: 10.0
        }
      }, 
      {
        position: {
          lat: 11.0,
          lng: 11.0
        }
      },
      {
        position: {
          lat: 9.0,
          lng: 9.0
        }
      },
    ],
    markers2: [
      {
        position: {
          lat: 10.0,
          lng: 9.0
        }
      },
      {
        position: {
          lat: 9.0,
          lng: 11.0
        }
      }
    ]
  }),
  created() {
  },
  async mounted() {
    // let count = await this.$axios.get('/count')
    // this.count = count.data.data
  }
}
</script>
