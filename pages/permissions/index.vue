<template>
  <section>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Permissions</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                    <nuxt-link to="/">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active">Permissions</li>
              </ol>
            </div><!-- /.col -->
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Manage Permissions</h3> &nbsp;
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-head-fixed table-striped">
                    <thead>
                      <tr>
                        <th
                          v-for="(header, h) in headers"
                          :key="`header${h}`"
                        >
                          {{ header.text }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, i) in items"
                        :key="`item${i}`"
                      > 
                        <td>{{ item.name }}</td>
                        <td 
                          v-for="(header, i) in headers.slice(1)"
                          :key="i"
                        >
                          <div class="form-check">
                            <input type="checkbox"
                              :color="baseColor" hide-details 
                              v-model="selected"
                              :value="item.id + '' + header.value"
                              @click="updatePermission(item.id, header.value)"
                            >
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
              </div>
              <!-- /.card -->
            </div>
          </div>
          <!-- /.row -->
        </div>
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManagePermissions',
  async asyncData({$axios}) { 
    let permissions = await $axios.get('/permissions');
    let roles = await $axios.get('/roles?search=all');
    return {
      permissions: permissions.data.data,
      roles: roles.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Permissions', value: 'permissions' }
    ],
    items: [],
    loading: true,
    selected: [] //This array will define the vmodel of checkbox
  }),
  mounted() {
    this.roles = this.restrictRolesList(this.roles)
    this.roles.forEach(role => {
      this.headers.push({
        text: role.name,
        value: role.id
      })
    });
    this.updateSelected(this.roles);
    // this.permissions = this.restrictPermissions(this.permissions)
    this.permissions.forEach(item => {
      this.items.push({
        id: item.id,
        name: item.name
      })
    });
    this.loading = false
  },
  methods: {
    async updatePermission(rowId, columnId) { // rowId is permission and columnId is role
      // Assign or unassign permission to role
      let permission_payload = {
        role_id: columnId,
        permission_id: rowId,
      }
      if(this.selected.indexOf(rowId + '' + columnId) == -1)
        await this.$axios.post('/assign_permissions', permission_payload)
      else
        await this.$axios.post('/unassign_permissions', permission_payload)
      this.updateSelected();
    },
    async updateSelected() {
      let roles = await this.$axios.get('/roles?search=all');
      this.roles = roles.data.data
      this.roles = this.restrictRolesList(this.roles)
      this.selected = [];
      roles.data.data.forEach(role => {
        role.permissions.forEach(per => {
          this.selected.push(per.id + '' + role.id)
        })
      })
    },
    restrictRolesList(roles) {
      roles = roles.filter(role => role.name != 'Super Admin')
      // roles = roles.filter(role => role.name != 'Admin')
      return roles;
    },
    restrictPermissions(permissions) {
      permissions = permissions.filter(permission => permission.name != 'Manage Organizations')
      permissions = permissions.filter(permission => permission.name != 'Super Admin Settings')
      return permissions;
    }
  }
}
</script>