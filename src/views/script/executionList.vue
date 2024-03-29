<template>
  <div class="bg-[#FFFFFF] rounded-[2px] p-[20px]">
    <div class="text-[18px] font-medium mb-[20px]">执行结果</div>
    <div class=" scroll-max-h overflow-y-auto">
      <a-collapse v-model:activeKey="activeKey" v-for="item in scriptList">
        <a-collapse-panel :key="item.id" :header="item.taskNumber" @click="getScriptById(item.id)">
          <template #extra>
            <div class="flex">
              <div
                class="w-[190px] rounded-[100px] h-[26px] leading-[26px] text-[14px] font-medium text-[#FFFFFF] pl-[16px]"
                :class="executeStatusColor[item.executeState]">
                {{ executeStatus[item.executeState] }}
              </div>
              <a-tooltip placement="left" color="#FFFFFF">
                <template #title>
                  <div class="text-[14px]">
                    <div v-if="item.executeState === 1" class="tips-css" @click="cancelExecuteScript(item.id)">取消执行</div>
                    <div v-if="item.executeState === 3" class="tips-css" @click="downloadScript(item.id, item.taskNumber)">
                      下载结果</div>
                    <div class="tips-css" @click="viewScript(item)">查看脚本</div>
                  </div>
                </template>
                <img src="@/assets/images/more-vertical.svg" class="h-[26px] cursor-pointer ml-[12px]" />
              </a-tooltip>
            </div>
          </template>
          <div>
            <div v-if="item.executeResult" class="whitespace-pre-line">{{ item.executeResult }}</div>
            <div v-else class="text-[#8C8C8C] py-[30px] text-center">NO Data</div>
          </div>
        </a-collapse-panel>
      </a-collapse>
      <div v-if="total > 9 && scriptList.length < total" class="text-center mt-[20px] cursor-pointer text-[#484FFF]"
        @click="gitMoreList">加载更多…</div>
    </div>
  </div>
  <a-modal :title="scriptTitle" v-model:open="scriptVisible" :footer="null" width="840px">
    <div style="height: 360px">
      <CodeEditor :readOnly="true" :value="scriptValue"></CodeEditor>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, onUnmounted } from "vue";
import { message } from "ant-design-vue";
import CodeEditor from '@/components/CodeEditor.vue';
import { executeStatus, executeStatusColor } from '@/enums/index';
import { apiScriptList, apiGetScriptById, apiCancelExecuteScript, apiDownloadScript } from '@/apis/script';
import { downloadRequest } from '@/utils/index'

const activeKey = ref([]);
const scriptTitle = ref('');
const scriptVisible = ref(false);
const scriptValue = ref('');
const listParams = reactive({
  page: 1,
  size: 10,
});
const total = ref(0);
const scriptList = ref([]);
const checkScriptInfo = ref({});
let isScriptLoop = ref()

//查看脚本
const viewScript = async (info: any) => {
  scriptVisible.value = true;
  scriptTitle.value = info.scriptName;
  scriptValue.value = info.scriptContent;
}

// 取消执行
const cancelExecuteScript = async (id: number) => {
  const res = await apiCancelExecuteScript({ id });
  if (res.code == 200) {
    getScriptList()
    message.success(res.message)
  } else {
    message.error(res.message)
  }
}

// 下载脚本
const downloadScript = async (id: number, taskNumber: string) => {
  const data = await apiDownloadScript({ id });
  try {
    await downloadRequest(data, `scriptingService_${taskNumber}.log`)
  } catch (error: any) {
    message.error(error)
  }
}

// 单个执行结果详情
const getScriptById = async (id: any) => {
  const res = await apiGetScriptById(id);
  if (res.code == 200) {
    checkScriptInfo.value = res.data;
    // message.success(res.message)
    scriptList.value = scriptList.value.map((item: any) => {
      if (item.id === id) {
        item = checkScriptInfo.value
      }
      return item
    })
    console.log('单个执行结果详情::', scriptList.value)
  } else {
    message.error(res.message)
  }
}

// 执行结果列表
const getScriptList = async () => {
  const res = await apiScriptList(listParams);
  if (res.code == 200) {
    if (listParams.page == 1) {
      scriptList.value = res.data.list
    } else {
      scriptList.value = [...scriptList.value, ...res.data.list]
    }
    total.value = res.data.total;
    // 判定循环终止
    const isStop = scriptList.value.filter((item: any) => {
      return item.executeState == 1 || item.executeState == 2
    }).length
    console.log('判定循环终止', isStop)
    if (isStop == 0) {
      clearInterval(isScriptLoop.value)
    }
  }
}

// 加载更多
const gitMoreList = () => {
  listParams.page++;
  getScriptList()
}

const useInterval = () => {
  isScriptLoop.value = setInterval(() => {
    getScriptList()
  }, 1000);
}

onMounted(() => {
  useInterval()
})

onUnmounted(() => {
  clearInterval(isScriptLoop.value)
})

defineExpose({
  getScriptList,
  useInterval
})
</script>

<style scoped lang="less">
.scroll-max-h {
  max-height: calc(100vh - 679px);
}</style>
