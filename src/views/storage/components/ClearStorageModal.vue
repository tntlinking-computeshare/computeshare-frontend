<template>
  <div>
    <a-modal v-model:open="showVisible" title="清空存储桶" centered="true" @ok="handleOk" @cancel="closeModal" width="697px" :footer="null">
      <div>
        <div class="text-[14px] my-[20px]">确认要永久删除存储桶“{{ bucketName }}”中的所有对象？</div>
        <div class="bg-[#FFFBE6] border border-solid border-[#FFE58F] rounded-[2px] py-[10px] px-[20px] flex">
          <div class="pt-[2px]">
            <img src="@/assets/images/IconWarning.png" class="h-[14px] w-[14px] mr-[8px]" />
          </div>
          <div class="text-[12px] text-[#595750]">
            清空存储桶将删除存储桶中的所有对象，而且无法撤消。<br>
            执行清空存储桶操作时添加到存储桶的对象可能会被删除。<br>
            为了防止在执行空存储桶操作时将新对象添加到此存储桶，您需要暂停使用该存储桶。
          </div>
        </div>
        <div class="text-center">
          <a-button :loading="clearLoading" type="primary" class="ant-btn-m mt-[50px]" @click="handleOk">清空</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { toRefs, onMounted, ref } from "vue";
import { apiClearBucket } from '@/apis/s3_storage'
import { message } from "ant-design-vue";

const props = defineProps({
  showVisible: {
    type: Boolean,
    default: false,
  },
  bucketName: {
    type: String,
    default: ''
  }
});
const { showVisible, bucketName } = toRefs(props);
const emit = defineEmits(['closeModal']);
const clearLoading = ref(false)

const handleOk = async () => {
  clearLoading.value = true
  const res = await apiClearBucket(bucketName.value);
  clearLoading.value = false
  if (res.code == 200) {
    message.success(res.message)
    closeModal();
  }else{
    message.error(res.message)
  }
}

const closeModal = () => {
  emit('closeModal')
}

onMounted(()=>{
  
})
</script>

<style scoped lang="less">



</style>