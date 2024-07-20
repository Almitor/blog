<script lang="ts" name="App" setup>
  import { defineComponent } from 'vue';
  import Person from "./components/Person.vue";
  import {VApp, VContainer, VMain} from "vuetify/components";


  // export default defineComponent({
  //   name:'App',
  //   components: {
  //     VApp,
  //     VMain,
  //     VContainer,
  //     Person
  //   },
  //   data(vm) {
  //     return {
  //       backgrounds: [
  //         new URL('@/assets/1.jpg', import.meta.url).href,
  //         new URL('@/assets/2.jpg', import.meta.url).href,
  //         new URL('@/assets/3.jpg', import.meta.url).href,
  //         new URL('@/assets/4.jpg', import.meta.url).href,
  //         new URL('@/assets/5.jpg', import.meta.url).href,
  //         new URL('@/assets/6.jpg', import.meta.url).href,
  //         new URL('@/assets/7.jpg', import.meta.url).href,
  //         new URL('@/assets/8.jpg', import.meta.url).href,
  //       ],
  //       currentBacImgIndex:0
  //     }
  //   },
  //   methods: {
  //     changeBacImg() {
  //       const randomIndex = Math.floor(Math.random() * this.backgrounds.length);
  //       this.currentBacImgIndex = randomIndex;
  //     }
  //   },
  //   computed: {
  //     currentBacImg() {
  //       return {
  //         backgroundImage: `url(${this.backgrounds[this.currentBacImgIndex]})`,
  //       }
  //     }
  //   },
  //   created() {
  //     this.changeBacImg();
  //   }
  // })

</script>

<template>
  <v-app>
    <router-view/>
<!--    <div class="bg-container d-flex flex-column" :style="currentBacImg" @click="changeBacImg">-->
<!--      <Person/>-->
<!--    </div>-->
  </v-app>

</template>

<style >
  html,body,#app{
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  .bg-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
