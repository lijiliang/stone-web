<template>
  <div :class=" hasRelative ? 'container-full-relative': ''" class="container-full">
    <div v-if="$slots.header" ref="header" class="container-full__header">
      <slot name="header"/>
    </div>
    <div class="container-full__body">
      <slot/>
    </div>
    <div v-if="$slots.footer" ref="footer" class="container-full__footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContainerFull',
  props: {
    hasRelative: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped lang="scss">
.container-full{
  position: absolute;
  top: 15px;
  right: 15px;
  bottom: 15px;
  left: 15px;
  // margin: 15px;
  display: flex;
  flex-direction: column;
  background: #fff;
  // height: 100%;
  // min-height: calc(100vh - 114px);
  // max-height: calc(100vh - 114px);
  overflow: hidden;
  border-radius: 5px;
  &__body{
    // flex: 1;
    flex-grow: 1;
    padding: 15px;
    overflow: auto;
    position: relative;
  }
  &__header, &__footer{
    padding: 15px;
  }
  &__header{
    border-bottom: 1px solid #ebeef5;
  }
  &__footer{
    padding: 20px;
    border-top: 1px solid #ebeef5;
  }
}
.container-full-relative{
  height: 100%;
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
  border-radius: 5px;
}
</style>

