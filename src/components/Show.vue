<script setup lang="ts">
import {ref, onMounted, defineProps, computed} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

// 接收父组件传递的参数
const props = defineProps({
  url:{
    type:String,
    required:true
  },
  detail:{
    type:String,
    required:true
  }
})

const url = props.url as string;
const detail = props.detail as string;

interface Note {
  filename: string;
  content:string;
  createdTime: Date;
  modifiedTime: Date;
}

const notes = ref<Note[]>([]);
const router = useRouter();

// 获取目录中文件，放入notes中
async function fetchNotes() {
  try {
    // console.log(`url:${url}`)
    const response = await axios.get(url);
    notes.value = response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}


// 跳转文件详情页面
function showNote(filename:string){
  router.push({
    name:detail,
    params:{
      filename
    },
    query:{
      url
    }
  })

}

onMounted(() => {
  fetchNotes();
});

// 移除文件名后缀.md
function removeExtension(filename:string){
  return filename.replace(/\.md$/,'');
}

</script>

<template>
  <v-container>

    <v-row justify="center">
      <v-col cols="12" xs="12" sm="10" md="8" >
        <v-card v-for="note in notes" :key="note.filename" hover class="mb-2 bg-shades-white"  @click="showNote(note.filename)">
          <v-card-title>{{ removeExtension(note.filename) }}</v-card-title>
          <v-card-actions>
            <v-card-subtitle>{{ new Date(note.modifiedTime).toLocaleDateString() }}</v-card-subtitle>
            <v-spacer/>
            <v-btn
                color="medium-emphasis"
                icon="mdi-heart"
                size="small"
            ></v-btn>

            <v-btn
                color="medium-emphasis"
                icon="mdi-share-variant"
                size="small"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>