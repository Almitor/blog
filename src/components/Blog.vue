<script setup lang="ts">
import Show from "@/components/Show.vue";
import {onMounted} from "vue";
const emit = defineEmits(['send-url']);
onMounted(()=>{
  setTimeout(()=>{
    emit('send-url',"/api/blogs")
  },0)
})
</script>

<template>
<Show url="/api/blogs" detail="BlogDetail"/>
</template>

<style scoped>

</style>