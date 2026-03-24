import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import 'vant/lib/index.css'
import App from './App.vue'
import Home from './views/Home.vue'
import Detail from './views/Detail.vue'
import Mine from './views/Mine.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/detail/:id', component: Detail },
  { path: '/mine', component: Mine }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

createApp(App).use(router).mount('#app')
