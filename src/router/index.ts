import { createRouter, createWebHistory} from 'vue-router';
import Person from '@/components/Person.vue';
import App from '@/App.vue'
import Layout from '@/components/Layout.vue';
import Note from "@/components/Note.vue";
import Blog from "@/components/Blog.vue";
import Work from "@/components/Work.vue";
import Other from "@/components/Other.vue";
import NoteDetail from "@/components/NoteDetail.vue";


const routes = [
    { path: '/', name: 'Person', component: Person },
    {
        path: '/',
        component: Layout,
        children: [
            { path: 'Note', name: 'Note', component: Note },
            { path: 'Note/:filename', name: 'NoteDetail', component: NoteDetail },
            { path: 'Blog', name: 'Blog', component: Blog },
            { path: 'Blog/:filename', name: 'BlogDetail', component: NoteDetail },
            { path: 'Work', name: 'Work', component: Work },
            { path: 'Other', name: 'Other', component: Other },
            { path: 'Other/:filename', name: 'OtherDetail', component: NoteDetail },

        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;