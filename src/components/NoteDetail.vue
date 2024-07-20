<script setup lang="ts">
import { marked, Renderer} from "marked";
import axios from "axios";
import {onMounted, ref} from "vue";
import { useRoute } from "vue-router";

const markdownText = ref("");
const route = useRoute();

const renderer = new Renderer();


// 自定义图片渲染逻辑
renderer.image = ({ href, title, text }) => {
  // 如果 href 是以 http(s) 开头的网络地址或以 / 开头的绝对路径，则直接使用
  // 否则加上相对路径前缀
  const newHref = href.startsWith('http') || href.startsWith('/') ? href : `/assets/${href.split('/').pop()}`;
  return `<img src="${newHref}" alt="${text}" title="${title || ''}" style="width: 100%">`;
};

// 配置 marked 使用自定义 Renderer
marked.setOptions({
  renderer
});


async function fetchMarkdown() {
  try {
    // 获取参数
    const filename = route.params.filename as string;
    const fileurl = route.query.url as string;
    const url = `${fileurl}/${filename}`;
    const response = await axios.get(url);

    // console.log(response.data); // 打印返回数据进行检查

    // 判断返回数据是否具有filename和content属性
    if (response.data && response.data.content) {
      markdownText.value = <string> marked(response.data.content);
    } else {
      console.error("Invalid response format or file not found:", response.data);
    }
  } catch (error) {
    console.error("Error fetching markdown file:", error);
  }
}

onMounted(() => {
  fetchMarkdown();
});
</script>

<template>
  <v-container class="pa-2">
    <v-row justify="center">
      <v-col cols="12" xs="12" sm="10" md="8" class="pa-0">
        <v-container>
          <div v-html="markdownText" class="markdown-body"></div>
        </v-container>
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/github-markdown-css@5.1.0/github-markdown.min.css');

.markdown-body {
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

</style>