<template>
  <div class="bg-[#FFFFFF]">
    <div class="top-css py-[18px] px-[40px] flex justify-end">
      <HeaderUser></HeaderUser>
    </div>
    <div class="h-[130px] px-[40px] flex justify-between items-center">
      <div class="menu-title">
        <bread-crumb :routes="breadCrumbInfo"/>
        <label v-if="curBarName == 'Storage'">存储桶
          <div class="mt-[10px] text-[16px] text-[#8C8C8C] font-light">存储桶是在存储数据的容器，您可以在存储桶中存储任意数量的对象。您可以创建、清空和删除存储桶，但只能删除空的存储桶。</div>
        </label>
        <label v-else-if="curBarName == 'StorageDetail'">
          <BreadCrumbBack currentName="" />
          <div class="text-[24px] font-medium text-[rgba(0,0,0,0.85)]">{{ prefixName || bucketName }}</div>
        </label>
        <label v-else>{{ sidebarName[curBarName] }}</label>
      </div> 
      <a-button v-if="curBarName === 'Resource'" type="primary" class="ant-btn-s" @click="createVisible = true;">创建实例</a-button>
      <a-button v-else-if="curBarName === 'Storage'" type="primary" class="ant-btn-s" @click="storageShowModal">创建存储桶</a-button>
    </div>
  </div>
  <CreateStorageModal v-if="storageVisible" ref="storageRef" :showVisible="storageVisible" :prefixValue="prefixValue" @closeModal="storageCloseModal" @loadTable="storageHandleDone"></CreateStorageModal>
  <CreateModal v-if="curBarName === 'Resource'" :createVisible="createVisible" @handleCancelCreate="createVisible=false;" @handleDone="handleDone"></CreateModal>
</template>
<script setup lang="ts">
import { watch, ref, onMounted, toRefs } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { sidebarName } from '@/enums/index';
// import { getPonitStr } from '@/utils/index';
import { apiGetUser } from '@/apis/user';
import HeaderUser from './HeaderUser.vue';
import BreadCrumb from "@/components/BreadCrumb.vue";
import BreadCrumbBack from "@/components/BreadCrumbBack.vue";
import CreateModal from "@/views/resource/create.vue";
import CreateStorageModal from '@/views/storage/components/CreateStorageModal.vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  prefixName:{
    type: String,
    default:''
  },
  breadCrumbInfo: {
    type: Array,
    default:[]
  }
})
const { prefixName,breadCrumbInfo } = toRefs(props);

const router = useRouter();
const route = useRoute();
const curBarName = ref(router.currentRoute.value.name);
const bucketName = (route.query.bucketName || '').toString();
const createVisible = ref(false);
const storageVisible = ref(false); // 创建存储桶
const storageRef = ref();
const prefixValue = ref('');
const emit = defineEmits(["handleDone"])

//获取用户信息
const getUserInfo = async () => {
  const res = await apiGetUser();
  if (res.code == 200) {
    // userInfo.value = res.data;
    prefixValue.value = res.data.name + '-' || res.data.telephoneNumber + '-'
  }else{
    message.error(res.message)
  }
}
const storageShowModal = async () => {
  await getUserInfo();
  storageVisible.value = true;
  storageRef.value.formData.name = ''; //清空字段
}
const storageCloseModal = () => {
  storageVisible.value = false;
}
const storageHandleDone = () => {
  emit('handleDone')
}
const handleDone = ()=>{
  createVisible.value = false
  emit('handleDone')
}
// 创建实例
const showCreateModal = () => {
  createVisible.value = true;
}

watch(() => router.currentRoute.value,
  (value) => {
    curBarName.value = value.name;
  }, { deep: true, immediate: true }
)

onMounted(async() => {
  // 此界面为公共组件，页面的具体信息由 传递数据 接收。比如面包屑的内容，只能接收，不能写死在这个界面
})

defineExpose({
  showCreateModal
})
</script>
<style lang="less" scoped>
.top-css{
  height: 72px;
  box-shadow: 0px 1px 4px 0px rgba(0,21,41,0.12);
}
.menu-title{
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0,0,0,0.85);
}
</style>