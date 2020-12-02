<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">My Profile [{{ user.roles[0].name }}]</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label class="form-label">Admin name</label>
                  <input type="text" class="form-control" placeholder="Enter name"
                    v-model="form.name"
                  >
                  <span class="help-block" 
                    v-if="errors.name"
                  >{{ errors.name[0] }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" placeholder="Enter email"
                    v-model="form.email"
                  >
                  <span class="help-block" 
                    v-if="errors.email"
                  >{{ errors.email[0] }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input type="number" class="form-control" placeholder="Enter phone"
                    v-model="form.phone"
                  >
                  <span class="help-block" 
                    v-if="errors.phone"
                  >{{ errors.phone[0] }}</span>
                </div>
                <div class="form-footer">
                  <nuxt-link class="btn btn-primary" to="/reset-password"
                    @click="store"
                  >
                    Reset Password
                  </nuxt-link>
                  <button class="btn btn-primary"
                    @click="store"
                  >Update Profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'MyProfile',
  async asyncData({$axios, store}) {
    let user = await $axios.get(`/users/${store.getters['auth/user'].id}`);
    return {
      form: user.data.data
    }
  },
  data: () => ({
    imageBase64: '',
    imageName: '',
    imageFile: ''
  }),
  components: {
    BackButton
  },
  mounted() {
    this.form.role_id = this.form.roles[0].id
  },
  methods: {
    async store() {
      await this.$axios.patch(`/users/${this.user.id}`, this.form)

      // To upload a file
      if(this.imageFile) {
        let formImage = new FormData()
        formImage.append('user_id', this.form.id)
        formImage.append('profile_image', this.imageFile)

        let response = await this.$axios.post(`/upload_profile_image`, formImage)
      }

      alert("Updated")
    },
    forgotPassword() {
      alert("Create functionality of forgot password")
    },
    pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (e) {
      const files = e.target.files
      if(files[0] !== undefined) {
        this.imageName = files[0].name
        if(this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader ()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageBase64 = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
        })
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageBase64 = ''
      }
    }
  }
}
</script> 