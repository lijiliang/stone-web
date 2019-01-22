<template>
  <i :class="`fa-${name}`" class="fa" aria-hidden="true"/>
</template>

<script>
// https://github.com/wjkang/d2-admin-pm/blob/master/src/components/d2-icon/index.vue
// <d2-icon name="refresh" />
import './font-awesome-4.7.0/css/font-awesome.min.css'
export default {
  name: 'D2Icon',
  props: {
    name: {
      type: String,
      required: false,
      // default: 'font-awesome'
      default: ''
    }
  }
}
</script>
