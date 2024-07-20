<script lang="ts" setup>
import {useRouter} from 'vue-router';
import img from '/favicon.webp';
import {computed, defineComponent, onMounted} from "vue";
import {VApp, VContainer, VMain} from "vuetify/components";

import { ref } from 'vue';

const imageSrc = ref('');
const router = useRouter();
const website = "www.almytor.cn";
const mailAddress = "2862710232@qq.com";
const snackbar = ref(false);

const backgrounds = ref([
  new URL('@/assets/1.webp', import.meta.url).href,
  new URL('@/assets/2.webp', import.meta.url).href,
  new URL('@/assets/3.webp', import.meta.url).href,
  new URL('@/assets/4.webp', import.meta.url).href,
  new URL('@/assets/5.webp', import.meta.url).href,
  new URL('@/assets/6.webp', import.meta.url).href,
  new URL('@/assets/7.webp', import.meta.url).href,
  new URL('@/assets/8.webp', import.meta.url).href,
]);

const currentBacImgIndex = ref(1);

// 生成随机索引数
function changeBacImgIndex() {
  const randomIndex = Math.floor(Math.random() * backgrounds.value.length);
  currentBacImgIndex.value = randomIndex;
}

// 点击后改变背景图片
function changeBacImg(){
  changeBacImgIndex();
  updateBackgroundImage();
}

// 修改背景图片
const currentBacImg = ref('');

// 预加载图片
function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
  });
}

// 更新图片
async function updateBackgroundImage() {
  const newSrc = backgrounds.value[currentBacImgIndex.value];
  await preloadImage(newSrc);
  currentBacImg.value = newSrc;
}

// 跳转到子页面
function navigateTo(routeName: string) {
  router.push({ path: `/${routeName}` });
}

// 网页加载调用一次修改背景图片
onMounted(async () => {
  await preloadImage(img);
  imageSrc.value = img;
  changeBacImgIndex();
  updateBackgroundImage();
})

// 复制邮箱到剪切板
function copyEmail(){
  navigator.clipboard.writeText(mailAddress).then(()=>{
    snackbar.value = true;
  }).catch((error)=>{
    console.error("无法复制文本" + error);
  })
}

</script>

<template>
  <div class="bg-container d-flex flex-column" :style="{ backgroundImage: `url(${currentBacImg})` }" @click="changeBacImg">
  <v-container>
    <v-row justify="center" align="center" >
      <v-col cols="12" xs="12" sm="10" md="8"  @click.stop>
        <v-card class="home-card pa-5"  elevation="24" >
          <v-card-item>
            <v-card-title class="text-h5">胡明海的个人网站</v-card-title>
            <v-card-subtitle class="mt-2">Hu MingHai's Personal Website</v-card-subtitle>
          </v-card-item>

          <v-divider></v-divider>

          <v-row align="center" class="mt-2">
            <v-col cols="12" xs="12" sm="12" md="6">
              <v-list-item class="justify-center w-100 imgContainer">
                <v-img
                    class="roundedImg"
                    :src="imageSrc"
                ></v-img>
              </v-list-item>
              <v-card-subtitle >{{ website }}</v-card-subtitle>
              <v-list-item>
                <a href="https://github.com/Almitor" class="mr-5">
                  <v-icon>mdi-github</v-icon>
                </a>
                <a @click="copyEmail">
                  <v-overlay
                      activator="parent"
                      location-strategy="connected"
                      origin="bottom start"
                      scroll-strategy="close"
                  >
                    <v-card class="pa-2">
                      {{mailAddress}}
                    </v-card>
                  </v-overlay>
                  <v-icon>mdi-email</v-icon>
                </a>
                <v-snackbar
                    v-model="snackbar"
                    :timeout="2000"
                    location="top"
                >
                  邮箱地址已复制
                </v-snackbar>
              </v-list-item>
            </v-col>

            <v-col cols="12" xs="12" sm="12" md="6" >
              <v-row>
                <v-col cols="6" class="pa-1">
                  <v-card class="col-card" hover @click="navigateTo('Blog')">
                    <v-card-item><v-icon>mdi-note</v-icon></v-card-item>
                    <v-card-title>博客</v-card-title>
                  </v-card>
                </v-col>
                <v-col cols="6" class="pa-1">
                    <v-card class="col-card" hover @click="navigateTo('Note')">
                      <v-card-item><v-icon>mdi-book-open-variant-outline</v-icon></v-card-item>
                      <v-card-title>笔记</v-card-title>
                    </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6" class="pa-1">
                    <v-card class="col-card" hover @click="navigateTo('Work')">
                      <v-card-item><v-icon>mdi-web</v-icon></v-card-item>
                      <v-card-title>作品</v-card-title>
                    </v-card>
                </v-col>
                <v-col cols="6" class="pa-1">
                    <v-card class="col-card" hover @click="navigateTo('Other')">
                      <v-card-item><v-icon>mdi-view-grid-plus-outline</v-icon></v-card-item>
                      <v-card-title>其他</v-card-title>
                    </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<style scoped>
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

.imgContainer{
  height: 13rem;
}
.home-card {
  text-align: center;
  color: white;
  font-family: Georgia, Times, serif;
  background: rgba(0,0,0,0.5);
}
.roundedImg {
  display: inline-block;
  border-radius: 50%;
  width: 13rem;
}
a {
  color: inherit;
  display: inline-block;
  transition: all 0.3s; /* 添加过渡动画效果 */
}

a:hover {
  transform: translateY(-3px); /* 添加浮动效果 */
}
.col-card {
  width: 100%;
  background: rgba(0,0,0,0.3);
  color: #eeeeee;
}
</style>
