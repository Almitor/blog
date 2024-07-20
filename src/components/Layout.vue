<script setup lang="ts" name="Layout">
import img from '@/assets/favicon.webp';
import {useRoute, useRouter} from 'vue-router';
import {computed, ref, shallowRef} from "vue";
import axios from "axios";
import  {jwtDecode} from 'jwt-decode'

const image = img;
const router = useRouter();
const route = useRoute();
const dialog = shallowRef(false);
const password = ref('');
let token = '';
let childUrl = '';

const items = [
  {name: '博客', value: 'Blog'},
  {name: '笔记', value: 'Note'},
  {name: '作品', value: 'Work'},
  {name: '其他', value: 'Other'}
]

//} 根据导航栏中按钮的value跳转相应的页面
function navigateTo(name: string) {
  router.push({
    name: name
  })
}

// 跳转首页
function indexTo() {
  router.push({
    name: "Person"
  })
}

// 抽屉导航是否弹出
const drawer = ref(false);

// 生成面包屑导航动态数组
const breadItems = computed(() => {
  const bread = [
    {
      title: '主页',
      disabled: false,
      href: "/"
    }
  ];

  // 当前路由信息
  const routeMatched = route.matched[1];
  // 获取匹配items的item项
  const routeTitle = items.find((item) => {
    if (routeMatched.path.includes(item.value))
      return item.name
  })
  // 二级导航
  if (routeTitle) {
    bread.push({
      title: routeTitle?.name as string,
      disabled: false,
      href: `/${routeTitle.value}`
      // href: router.resolve({
      //   name: routeTitle.value
      // }).href
    })
  }

  // 三级级导航
  if (route.params.filename) {
    // console.log(route.params.filename.slice(0,-3))
    bread.push({
      title: route.params.filename.slice(0, -3) as string,
      disabled: true,
      href: ''
    })
  }
  // console.log(bread)
  return bread;
})

// 面包屑导航分隔符
const divider = '-'

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
// 验证口令获取token
function authenticateAndUpload (){
    // 令牌失效或不存在
    axios.post('/api/authenticate',{
      password: password.value
    }).then(response => {
      token = response.data.token;
      console.log(`验证成功 token: ${response.data.token}`);
      // 隐藏对话框
      dialog.value = false;
      // 将token存放在sessionStorage中
      sessionStorage.setItem('accessToken', token);
      fileInput.value?.click();
    }).catch(error => {
      console.log("验证失败" + error)
      alert("口令错误，请重新输入！")
      password.value = '';
    })
}

interface DecodedToken{
  exp: number;
}

// 验证token是否过期
function isTokenExpired(){
  token = sessionStorage.getItem('accessToken') as string;
  if (token){
    //令牌存在
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    if (currentTime < decoded.exp){
      // 令牌未过期
      dialog.value = false;
      fileInput.value?.click();
    }else {
      // 令牌失效或过期
      dialog.value = true;
    }
    console.log(`currentTime: ${currentTime}`)
    console.log(`decoded: ${decoded.exp}`)
  }else {
    // 令牌不存在
    dialog.value = true;
  }
}

// 文件修改
function onFileChange(event:any){
  selectedFile.value = event.target ? event.target.files[0]:null;
  if (selectedFile.value){
    console.log(`文件已选择：${selectedFile.value}`)
  }
  sendFile();
}

// 获取api路径
function getUrl(value:string){
  childUrl = value
}


function sendFile(){
  if (!selectedFile.value){
    alert("请选择一个文件！")
    return;
  }
  let url = childUrl;
  // 获取当前路由
  let formData = new FormData();
  formData.append('file',selectedFile.value);
  console.log(formData.get('file'))
  axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}` // 在请求头中添加 JWT 令牌
    }
  })
      .then(response => {
        console.log('上传成功', response);
        //刷新页面
        location.reload();
      })
      .catch(error => {
        console.log('上传失败', error)
        alert("token失效，请重新验证")
      })
}
</script>

<template>
  <v-layout>
    <v-app-bar
        class="appbar"
        density="comfortable"
    >
      <template v-slot:prepend>
        <v-avatar>
          <v-img
              :src="image"
              @click="indexTo"
          >
          </v-img>
        </v-avatar>
      </template>
      <v-app-bar-title>胡明海的个人网站</v-app-bar-title>

      <v-btn
          class="navBtn"
          size="x-large"
          height="100%"
          v-for="item in items"
          @click='navigateTo(`${item.value}`)'
      >
        {{ item.name }}
      </v-btn>

      <v-app-bar-nav-icon
          @click.stop="drawer=!drawer"
          class="navMenu"
      >
      </v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        temporary
        location="top"
    >
      <v-list>
        <v-list-item
            v-for="item in items"
            :key="item.value"
            @click="navigateTo(item.value)"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-blue-grey-lighten-3">

      <v-container class="breadNav">
        <v-row class="justify-center">
          <v-col cols="10" xs="10" sm="8" md="6" >
            <v-breadcrumbs
                divider="-"
                :items="breadItems"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-home-outline"></v-icon>
              </template>
              <template v-slot:title="{ item }">
                {{ item.title }}
              </template>
            </v-breadcrumbs>
          </v-col>

          <v-col cols="2" class="d-flex justify-end align-center">
            <input type="file" ref="fileInput" @change="onFileChange" style="display: none"/>

            <v-dialog
                v-model="dialog"
                max-width="400"
            >
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    v-bind="activatorProps"
                    @click="isTokenExpired"
                >上传</v-btn>
              </template>

              <v-card
                  prepend-icon="mdi-account"
                  title="身份验证"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col
                        cols="12"
                    >
                      <v-text-field
                          label="请输入口令"
                          required
                          v-model="password"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <small class="text-caption text-medium-emphasis">口令正确才能执行该操作</small>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      text="取消"
                      variant="plain"
                      @click="dialog = false"
                  ></v-btn>

                  <v-btn
                      color="primary"
                      text="确认"
                      variant="tonal"
                      @click="authenticateAndUpload"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>

      </v-container>



      <router-view @send-url="getUrl"/>

    </v-main>
  </v-layout>
</template>

<style scoped>
.appbar {
  background-color: #155263;
  color: white;
}
.breadNav {
  display: flex;
  justify-content: center;
  margin-bottom: -20px;
  color: #155263;
  font-size: 1.2rem;
}

@media (min-width: 300px) and (max-width: 768px) {
  .navBtn {
    display: none;
  }

  .navMenu {
    display: block;
  }
}

@media (min-width: 769px) {
  .navBtn {
    display: block;
  }

  .navMenu {
    display: none;
  }
}

</style>