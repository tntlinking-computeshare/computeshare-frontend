<!-- 壳子 -->
<template>
  <div class="flex dashboard-index rounded-[12px]">
      <div class="dashboard-index-left">
        <img src="@/assets/images/menu-logo-cs.png" class="h-[38px] my-[32px] mx-[24px] cursor-pointer" @click="goHome" />
        <a-menu theme="dark" v-model:selectedKeys="selectedKeys" style="width: 312px">
            <a-menu-item v-for="item in menuRouterList" :key="item.name" class="group">
                <router-link :to="item.name">
                    <div class="flex items-center">
                      <!-- 小图标默认是暗色，选中是亮色 -->
                      <img :src="getImageURL(`${item.name+'Dark'}.png`)" class="h-[20px] w-[20px] mr-[17px] dark-img inline-block group-hover:hidden" />
                      <img :src="getImageURL(`${item.name}.png`)" class="h-[20px] w-[20px] mr-[17px] demo-img hidden group-hover:inline-block" />
                      <span>{{ sidebarName[item.name] }}</span>
                    </div>
                </router-link>
            </a-menu-item>
        </a-menu>
      </div>
      <div class="dashboard-index-right bg-[#F6F6FB] h-screen overflow-hidden">
        <!-- <Header /> -->
        <router-view />
      </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onBeforeMount } from 'vue';
import { useRouter } from "vue-router";
import useAssets from "@/stores/useAssets";
// import Header from "@/components/Header.vue";
import { sidebarName } from '@/enums/index'

const { getImageURL } = useAssets();
const router = useRouter();
const curBarName = ref(router.currentRoute.value.name);
const selectedKeys = ref<any>(['']);
const menuRouterList = ref<any>([]);

const serviceBool = ref(false)
const userBool = ref(false)

const goHome = () => {
if (userBool.value) {
  window.open('/')
} else {
  router.push('/')
}
}

onBeforeMount(() => {
const dashboard: any = router.options.routes.find((val) => { return val.path === '/' });

// 过滤出所有服务那边的菜单
const serviceArr = dashboard.children.filter((item: any) => {
  return item.meta.isShow && !item.meta.isPersonal
})
serviceBool.value = serviceArr.map((item: any) => { return item.name }).includes(curBarName.value)
// isPersonal=false，则不是账户类菜单，用来区分不显示出来的子菜单
if (serviceBool.value || !router.currentRoute.value.meta.isPersonal) {
  menuRouterList.value = serviceArr
}

// 过滤出所有账户那边的菜单
const userArr = dashboard.children.filter((item: any) => {
  return item.meta.isShow && item.meta.isPersonal
})
userBool.value = userArr.map((item: any) => { return item.name }).includes(curBarName.value)
// isPersonal=true，是账户类菜单，用来区分不显示出来的账户类子菜单
if (userBool.value || router.currentRoute.value.meta.isPersonal){
  menuRouterList.value = userArr
}
})

watch(() => router.currentRoute.value,
(value) => {
  selectedKeys.value = value.meta.sidebarMap;
}, { deep: true, immediate: true }
)

</script>

<style scoped lang="less">

.dashboard-index {
min-height: calc(100% - 114px);

.dashboard-index-left{
  height: 100vh;
  background: #001529;
  box-shadow: 2px 0px 6px 0px rgba(0,21,41,0.35);
}

.dashboard-index-right {
  flex: 1;
}
}
:deep(.ant-menu){
font-size: 16px; 
font-weight: 500;
}
:deep(.ant-menu .ant-menu-item){
border-radius: 0px;
}
:deep(.ant-menu-vertical .ant-menu-item){
padding-left: 24px;
height: 60px;
line-height: 60px;
width: 100%;
margin: 0;
}
:deep(.ant-menu-dark .ant-menu-item-selected){
background-color: #484FFF;
.dark-img{
  display: none;
}
.demo-img{
  display: inline-block;
}
}
</style>