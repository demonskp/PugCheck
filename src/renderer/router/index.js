import Vue from 'vue'
import Router from 'vue-router';

//导入页面
import homePage from '../pages/homePage.vue';
import earnCheckPage from '../pages/earningCheck.vue';
import backServicePage from '../pages/backServicePage.vue';
import VATCheckPage from '../pages/VATCheck.vue';

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'landing-page',
      component: homePage
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/earnCheckPage',
      name: 'earncheck-page',
      component: earnCheckPage
    },
    {
      path: '/backServicePage',
      name: 'back-service-page',
      component: backServicePage
    },
    {
      path: '/VATCheck',
      name: 'VATCheck-page',
      component: VATCheckPage
    }

  ]
})