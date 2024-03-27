<!-- 我的资源 -->
<template>
  <div class="h-[130px] px-[40px] flex justify-between items-center bg-[#ffffff]">
    <div class="menu-title">云服务器</div>
    <a-button type="primary" class="ant-btn-s" @click="createVisible = true;">创建实例</a-button>
  </div>
  <div class="p-[20px] scroll-contain-h">
    <div class="bg-[#FFFFFF] scroll-max-h rounded-[2px] p-[20px] overflow-y-auto">
      <div v-if="!instanceList.length"
        class="bg-[#FAFBFF] border border-dashed border-[#A6A6A6] rounded-[8px] py-[100px] px-[120px]">
        <div class="text-[32px] font-medium text-[#000000] mb-[30px]">您还没有云服务器实例</div>
        <div class="text-[#242425] text-[24px]">点击<label class="text-[#484FFF] cursor-pointer font-medium"
            @click="showCreateModal">创建实例</label>，即可拥有一台云服务器，开始搭建您的云上业务！</div>
      </div>
      <div v-else class="gap-[30px] grid grid-cols-4">
        <div class="card-div" v-for="(item, key) in instanceList" :key="key">
          <div class="flex justify-between items-center mb-[20px]">
            <div class="text-[21px] font-semibold text-ellipsis pr-[15px]">{{ item.name }}</div>
            <a-tooltip placement="bottom" color="#FFFFFF">
              <template #title>
                <div class="text-[14px]">
                  <!-- 运行中 -->
                  <div v-if="item.status === 1">
                    <div class="tips-css" @click="operate(item.id)">访问实例</div>
                    <div class="tips-css" @click="reStart(item.id)">重启实例</div>
                    <div class="tips-css" @click="instanceStop(item.id)">关闭实例</div>
                    <div class="tips-css" @click="resetVM(item)">重置实例</div>
                    <div class="tips-css" @click="changeName(item)">修改名称</div>
                    <div class="tips-css" @click="configurationMapping(item.id)">配置映射</div>
                  </div>
                  <!-- 已关闭 -->
                  <div v-else-if="item.status === 4">
                    <div class="tips-css" @click="instanceStart(item.id)">启动实例</div>
                    <div class="tips-css" @click="resetVM(item)">重置实例</div>
                    <div class="tips-css" @click="changeName(item)">修改名称</div>
                  </div>
                  <!-- 已过期 -->
                  <div v-else-if="item.status === 8" class="tips-css" @click="instanceDelete(item.id)">删除实例</div>
                  <div v-else class="tips-css-none">暂无操作</div>
                </div>
              </template>
              <img src="@/assets/images/more.svg" class="w-[28px] cursor-pointer" />
            </a-tooltip>
          </div>
          <div class="mb-[10px]">
            <label class="card-sub-title">规格：</label>
            <label>{{ item.core }}核 {{ item.memory }}GB</label>
          </div>
          <div class="mb-[10px]">
            <label class="card-sub-title">操作系统：</label>
            <label>{{ item.imageName }}</label>
          </div>
          <div class="mb-[10px]">
            <label class="card-sub-title">状态：</label>
            <label class="rounded-[11px] text-[14px] font-medium text-[#FFFFFF] px-[23px] py-[3px]"
              :class="resourceStatusColor[item.status]">{{ resourceStatus[item.status] }}</label>
          </div>
          <div class="mb-[20px]">
            <label class="card-sub-title">到期时间：</label>
            <label>{{ transTimestamp(item.expirationTime * 1, '.') }}</label>
          </div>
          <div class="border-t text-[14px]">
            <div class="pt-[20px] pb-[5px]">CPU使用率</div>
            <div class="bg-[#F8F9FC] rounded-[5px] h-[49px] echarts-width">
              <Echarts v-if="echartsWidth != '' && item.cpuArr.length" :echartsId="`cpucharts${key}`"
                :echartsData="item.cpuArr" :echartsXData="item.cpuArr" :echartsWidth="echartsWidth" seriesName="CPU"
                areaColor="#5BD171" areaColor1="#94EAAA"></Echarts>
              <div v-else class="text-[#BFBFBF] leading-[49px] text-center">NO Data</div>
            </div>
            <div class="pt-[10px] pb-[5px]">内存使用率</div>
            <div class="bg-[#F8F9FC] rounded-[5px] h-[49px]">
              <Echarts v-if="echartsWidth != '' && item.memoryArr.length" :echartsId="`memorycharts${key}`"
                :echartsData="item.memoryArr" :echartsXData="item.memoryArr" :echartsWidth="echartsWidth" seriesName="内存"
                areaColor="#487DE9" areaColor1="#7EB4F6"></Echarts>
              <div v-else class="text-[#BFBFBF] leading-[49px] text-center">NO Data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <Footer></Footer> -->
  </div>
  <CreateModal :createVisible="createVisible" @handleCancelCreate="createVisible = false;" @handleDone="handleDone">
  </CreateModal>
  <resetVMModal v-if="resetImageId!=0" :visible="resetVisible" :id="handleId" :resetImageId="resetImageId" @handleCancel="resetVisible = false;" @handleDone="getInstanceList"></resetVMModal>
  <changeNameModal v-if="handleId!=''" :visible="changeVisible" :id="handleId" @handleCancel="changeVisible = false;" @handleDone="getInstanceList"></changeNameModal>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { message } from "ant-design-vue";
import { transTimestamp } from '@/utils/dateUtil';
import { resourceStatus, resourceStatusColor } from '@/enums/index'
import Footer from "./footer.vue"
import resetVMModal from "./components/resetVMModal.vue";
import changeNameModal from "./components/changeNameModal.vue";
import Echarts from "@/components/Echarts.vue";
import {
    apiGetInstanceList,
    apiInstanceStart,
    apiInstanceStop,
    apiInstanceDelete,
    apiInstanceRestart,
    apiInstanceVncURL,
} from '@/apis/compute';
import CreateModal from "@/views/resource/create.vue";

const instanceList = ref([]);
const createVisible = ref(false);
const resetVisible = ref(false);
const resetImageId = ref(0);
const changeVisible = ref(false);
const handleId = ref('');
const echartsWidth = ref('');
let isLoop = ref()

const emit = defineEmits(['changeTabKey'])

const operate = (id: string) => {
    let protocol = window.location.protocol
    let domain =  window.location.host

  // 访问实例是跳走，需要带走实例id
    window.open(`${protocol}//vnc.${domain}/vnc_lite.html?host=api.${domain}&instanceId=${id}`)
}

// 创建实例
const showCreateModal = () => {
  createVisible.value = true
}

//启动实例
const instanceStart = async (id: string) => {

  const res = await apiInstanceStart(id);
  if (res.code == 200) {
    getInstanceList()
    message.success(res.message)
  } else {
    message.error(res.message)
  }
}

// 重启实例
const reStart = async(id: string)=>{
  const res = await apiInstanceRestart(id);
  if (res.code == 200) {
    getInstanceList()
    message.success(res.message)
  } else {
    message.error(res.message)
  }
}

//关闭实例
const instanceStop = async (id: string) => {

  const res = await apiInstanceStop(id);
  if (res.code == 200) {
    getInstanceList()
    message.success(res.message)
  } else {
    message.error(res.message)
  }
}

// 配置映射
const configurationMapping = (id: string) => {
  emit('changeTabKey')
}

// 重置虚拟机
const resetVM = async(item: any) => {
  console.log('重置虚拟机', item)
  resetVisible.value = true;
  resetImageId.value = item.imageId;
  handleId.value = item.id;
}

// 修改名称
const changeName = async(item: any) => {
  console.log('修改名称:', item)
  changeVisible.value = true;
  handleId.value = item.id;

}

//删除实例
const instanceDelete = async (id: string) => {

  const res = await apiInstanceDelete(id);
  if (res.code == 200) {
    getInstanceList()
    message.success(res.message)
  } else {
    message.error(res.message)
  }
}

// 实例列表
const getInstanceList = async () => {
  const res = await apiGetInstanceList();
  if (res.code == 200) {
    instanceList.value = res.data
    // 取 cpu 和 内存
    instanceList.value = instanceList.value.map((item: any) => {
      let cpuArr = []
      let memoryArr = []
      cpuArr = item.stats.map((en: any) => {
        return en.cpuUsage
      })
      memoryArr = item.stats.map((en: any) => {
        return en.memoryUsage
      })
      return { cpuArr, memoryArr, ...item }
    })
    // 判定循环终止
    // const isStop = instanceList.value.filter((item: any) => {
    //   return item.status == 0
    // }).length
    // console.log('判定循环终止', isStop)
    // if (isStop == 0) {
    //   clearInterval(isLoop.value)
    // }
  } else {
    message.error(res.message)
  }
}

// 新建实例完成
const handleDone = () => {
  createVisible.value = false;
  getInstanceList()
}

onMounted(() => {
  getInstanceList()
  // 开启循环去实时调实例的状态
  isLoop.value = setInterval(() => {
    getInstanceList()
  }, 3000);

  setTimeout(() => {
    if (instanceList.value.length > 0) {
      echartsWidth.value = (document.getElementsByClassName('echarts-width')[0].clientWidth - 2) + 'px';
    }
  }, 1000);
})

onUnmounted(() => {
  clearInterval(isLoop.value)
})
</script>

<style scoped lang="less">
.scroll-max-h {
  // max-height: calc(100vh - 515px);
}

.card-div {
  box-shadow: 0px 0px 20px 0px #EBEBF5;
  border-radius: 8px;
  border: 1px solid #E9E9E9;
  padding: 30px 20px 20px 20px;
}

.card-sub-title {
  font-size: 14px;
  color: #8C8C8C;
}

.border-t {
  border-top: 1px solid #E9E9E9;
}

.menu-title {
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
</style>
