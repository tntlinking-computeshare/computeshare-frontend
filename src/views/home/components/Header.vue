<template>
  <div class="mx-auto h-[54px] px-[32px] fixed w-full top-0 left-0 z-50" ref="headerRef">
    <div class="max-w-[1440px] flex justify-between items-center mx-auto ">
      <div class="flex items-center justify-between">
        <img src="@/assets/images/logo-b.png" class="h-[24px]" />
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="changeMenuItem" />
      </div>

      <div>
        <a-button class="mr-[12px]" @click="router.push('/login')">登录</a-button>
        <a-button type="primary" @click="router.push('/login')">注册</a-button>
      </div>
    </div>

  </div>
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const headerRef = ref();
const current = ref<string[]>(['']);
const items = ref<MenuProps['items']>([
  {
    key: 'power',
    label: '算力管理平台',
    title: 'Power',
  },
  {
    key: 'provider',
    label: '成为提供商',
    title: 'Provider',
    disabled: true,
  },
  {
    key: 'statistical',
    label: '统计数据',
    title: 'Statistical',
    disabled: true,
  },
  {
    key: 'documentCenter',
    label: '文档中心',
    title: 'Document Center',
    disabled: true,
  },
  {
    key: 'aboutUs',
    label: '关于我们',
    title: 'About Us',
    disabled: true,
  },
])

const changeMenuItem = ({ item, key, keyPath }) => {
  console.log(item, key, keyPath);
  if (key === 'power') {
    router.push('/login')
  }

}

</script>
<style lang='less' scoped>
:deep(.ant-menu-light) {
  background-color: transparent;
}

:deep(.ant-menu-horizontal) {
  border-bottom: 0px;
}
</style>