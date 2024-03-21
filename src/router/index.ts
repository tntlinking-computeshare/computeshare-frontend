// 路由
import { createRouter, createWebHistory } from "vue-router";
let router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: '/dashboard/resource',
      component: () => import('@/views/dashboard/index.vue'),
      children: [
        {
          path: "/dashboard/resource",
          name: "Resource",
          component: () => import('@/views/resource/index.vue'),
          meta: {
            isShow: true,
            isPersonal: false,
            sidebarMap: ['Resource'],
          }
        },
        {
          path: "/dashboard/script",
          name: "Script",
          component: () => import('@/views/script/index.vue'),
          meta: {
            isShow: false,
            isPersonal: false,
            sidebarMap: ['Script'],
          }
        },
        {
          path: "/dashboard/storage",
          name: "Storage",
          component: () => import('@/views/storage/index.vue'),
          meta: {
            isShow: true,
            isPersonal: false,
            sidebarMap: ['Storage'],
          }
        },
        {
          path: "/dashboard/storageDetail",
          name: "StorageDetail",
          component: () => import('@/views/storage/detail.vue'),
          meta: {
            isShow: false,
            isPersonal: false,
            sidebarMap: ['Storage'],
          }
        },
        {
          path: "/dashboard/user",
          name: "User",
          component: () => import('@/views/user/index.vue'),
          meta: {
            isShow: true,
            isPersonal: true,
            sidebarMap: ['User'],
          }
        },
        {
          path: "/dashboard/cycles",
          name: "Cycles",
          component: () => import('@/views/cycles/index.vue'),
          meta: {
            isShow: true,
            isPersonal: true,
            sidebarMap: ['Cycles'],
          }
        },
        {
          path: "/dashboard/cyclesDetail",
          name: "CyclesDetail",
          component: () => import('@/views/cycles/detail.vue'),
          meta: {
            isShow: false,
            isPersonal: true,
            sidebarMap: ['Cycles'],
          }
        },
        {
          path: "/dashboard/order",
          name: "Order",
          component: () => import('@/views/order/index.vue'),
          meta: {
            isShow: true,
            isPersonal: true,
            sidebarMap: ['Order'],
          }
        },
        {
          path: "/dashboard/renewal",
          name: "Renewal",
          component: () => import('@/views/renewal/index.vue'),
          meta: {
            isShow: true,
            isPersonal: true,
            sidebarMap: ['Renewal'],
          }
        },
        {
          path: "/dashboard/developer",
          name: "Developer",
          component: () => import('@/views/developer/index.vue'),
          meta: {
            isShow: true,
            isPersonal: true,
            sidebarMap: ['Developer'],
          }
        }
      ]
    },
    {
      path: '/home',
      name: 'Home',
      component: ()=> import('@/views/home/index.vue')
    },
    {
      path: "/login",
      name: "login",
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: "/system",
      name: "system",
      component: () => import('@/views/resource/system.vue')
    }
  ],
  // 每次切换路由页面滚动到顶部
  scrollBehavior() {
    return { top: 0 }
  }
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || '';
  // 如果用户已登录
  if (token) {
    // 访问登录页则跳回首页
    if (to.path == "/login" || to.path === '/home') {
      next({ path: "/" });
    } else {
      // 如果访问其他页面则放行
      next();
    }
  } else { // 如果用户未登录
    if (to.path == "/login" || to.path === '/home') {
      next();
    } else {
      // 如果访问其他页面则返回登录界面
      next({ path: "/home" });
    }
  }
})

export default router;