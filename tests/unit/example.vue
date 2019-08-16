<template>
  <div>
    {{ $t('This is my first test string')}}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Example',
});
</script>

<style lang="stylus" module>
.example {
  color: red;
}
</style>
