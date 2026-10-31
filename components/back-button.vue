<template>
  <nuxt-link :to="link">
    <button
      class="btn btn-danger"
      small
      :title="title"
    >
      <i class="fas fa-arrow-left"></i>
    </button>
  </nuxt-link>
</template>

<script type="text/javascript">

export default {
  props: [
    'title', 'link'
  ]
}
</script>