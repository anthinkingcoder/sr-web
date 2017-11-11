import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/index.vue'
import Login from '../components/login.vue'
import Knowledge from '../components/knowledge/list.vue'
import Topic from '../components/topic/list.vue'
import TopicCategory from '../components/topic/category/list.vue'
import ExpandKnowledge from '../components/expand_knowledge/list.vue'
import Example from '../components/example/list.vue'
import StudentWork from '../components/student_work/list.vue'
import Resource from '../components/resource/list.vue'
import Teacher from '../components/teacher/list.vue'
import Web from '../components/web.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/admin/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/admin/main/knowledge/list',
          component: Knowledge
        },
        {
          path: '/admin/main/topic/list',
          component: Topic
        },
        {
          path: '/admin/main/topic/category/list',
          component: TopicCategory
        },
        {
          path: '/admin/main/expand_knowledge/list',
          component: ExpandKnowledge
        },
        {
          path: '/admin/main/example/list',
          component: Example
        },
        {
          path: '/admin/main/student_work/list',
          component: StudentWork
        },
        {
          path: '/admin/main/resource/list',
          component: Resource
        },
        {
          path: '/admin/main/teacher/list',
          component: Teacher
        }
      ]
    },
    {
      path: '/admin/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin/web',
      name: 'web',
      component: Web
    }
  ]
})
