<script>
import Vue from 'vue'
import { defineComponent, computed } from '@vue/composition-api'
import Tags from '../tags.vue'

export default defineComponent({
  name: 'hello-component',
  components: { Tags },
  props: {
    firstName: String,
    lastName: String,
    description: String,
  },
  setup(props, context) {
    // Accessing global filters
    const uppercase = Vue.filter('uppercase')

    const updateFirstName = () => {
      context.emit('new-first-name', uppercase(props.firstName))
    }

    const desc = computed(() => uppercase(props.description))

    return { updateFirstName, desc }
  },
})
</script>

<template>
  <div class="card blue-grey darken-1">
    <div class="card-content white-text">
      <span class="card-title"> Hi, {{ firstName }} {{ lastName }} </span>
      <p>{{ desc }}</p>
    </div>
    <div class="card-action">
      <a href="https://vuejs.org/guide/overview.html">Vue.js</a>
      <button @click="updateFirstName">Update first name from Vue</button>
    </div>
    <tags></tags>
  </div>
</template>
