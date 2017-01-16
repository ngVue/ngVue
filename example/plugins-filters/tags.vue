<template>
  <div class="tags">
    <div v-for="tag in tags" class="chip">
      {{ tag | uppercase }}
    </div>
  </div>
</template>
<style scoped>
  .tags {
    text-align: right;
    margin-bottom: 30px;
  }
</style>
<script>
  export default {
    data () {
      return {
        tags: ['angular', 'ngVue', 'VueJS']
      }
    }
  }
</script>
