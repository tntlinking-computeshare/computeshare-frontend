<template>
  <Header :class="isScroll ? 'scroll-css' : ''"></Header>
  <div id="fullpage">
    <div class="section">
      <div class="main-content-first">

        <div class="max-w-[1280px] mx-auto text-center">
          <div class="text-[64px] pt-[190px]">一种开放的算力载体</div>
          <div>通过聚合个人和团体的闲置算力资源，利用智能配置为用户和供应商提供弹性的计算服务，实现计算资源的高效共享与优化配置</div>
          <div class="flex justify-center mx-auto mt-[48px] items-center">
            <a-button type="primary" class="mr-[16px] w-[136px] h-[42px]" @click="router.push('/login')">开始使用</a-button>
            <div class="">提供算力></div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="text-center main-content-two pt-[96px]">
        <div class="text-[48px]">共享算力如何运行</div>
        <div>通过聚合个人和团体的闲置算力资源，利用智能配置为用户和供应商提供弹性的计算服务，<br />实现计算资源的高效共享与优化配置</div>
        <div class="mt-[136px] w-[700px] mx-auto relative">
          <img src="@/assets/images/page2_bg1.png" class="" />
          <div class="absolute w-[300px] top-0">
            <div class="text-right text-[#484FFF]">对于提供商</div>
            <div class="text-left text-[#596273] text-[14px]"> 通过聚合个人和团体的闲置算力资源，利用智能配置为用户和供应商提供弹性的计算服务，实现计算资源的高效共享与优化配置
            </div>
          </div>
          <div class="absolute w-[300px] top-[75px] right-[-150px]">
            <div class="text-left text-[#484FFF]">对于使用者</div>
            <div class="text-left text-[#596273] text-[14px]">通过聚合个人和团体的闲置算力资源，利用智能配置为用户和供应商提供弹性的计算服务，实现计算资源的高效共享与优化配置
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class=" main-content-three text-[#fff]  md:px-[96px] px-[32px] ">
        <div class="flex grid items-center justify-between grid-cols-2 md:gap-48 gap-12 max-w-[960px] mx-auto h-full">
          <div class="">
            <div class="text-[36px] mb-[8px] ">开始使用共享算力</div>
            <div class="text-16px">通过聚合个人和团体的闲置算力资源，利用智能配置为用户和供应商提供弹性的计算服务，实现计算资源的高效共享与优化配置</div>
          </div>
          <div class=" py-[32px] md:px-[64px] px-[32px] bg-white/30 rounded-[12px]  ">
            <div class="text-[12px]">通过聚合个人和团体的闲置算力资源，利用智能配置为用户和供应商提供弹性的计算服务，实现计算资源的高效共享与优化配置</div>

            <div
              class="bg-[#fff] text-[#000] rounded-[20px] py-[8px] px-[24px] text-[16px] font-medium mt-[12px] flex justify-between items-center cursor-pointer hover:text-[#484FFF]">
              <div @click="router.push('/login')">开始使用</div>
              <!-- <img src="@/assets/icons/arrow.svg" class="h-[12px] hover:bg-[#484FFF]" /> -->
              <ArrowRightOutlined />
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="section">
      <div class=" main-content-four pt-[96px] md:px-[96px] px-[32px]">
        <div class=" text-center text-[36px] mb-[96px]">产品特性</div>
        <div class="flex grid justify-center grid-cols-3 gap-16 max-w-[1440px] mx-auto">
          <div class="bg-white rounded-[12px] border border-solid border-[#F1F3FE] p-[32px] item-css pb-[80px]">
            <img src="@/assets/images/page4_icon1.png" class="h-[50px]" />
            <div class="text-[18px] item-title mt-[16px] mb-[8px]">开放共享计算资源</div>
            <div class="text-[14px] text-[#596273]">个人和组织开放自己闲置的CPU/GPU等各类计算设备，实现闲置资源的再利用，为用户提供便捷的计算服务支持。</div>
          </div>
          <div class="bg-white rounded-[12px] border border-solid border-[#F1F3FE] p-[32px] item-css">
            <img src="@/assets/images/page4_icon2.png" class="h-[50px]" />
            <div class="text-[18px] item-title mt-[16px] mb-[8px]">安全可靠的资源访问</div>
            <div class="text-[14px] text-[#596273]">通过加密等技术,为用户和资源提供者提供安全的计算环境。保护数据和资源在存储、传输过程中的安全性。</div>
          </div>
          <div class="bg-white rounded-[12px] border border-solid border-[#F1F3FE] p-[32px] item-css">
            <img src="@/assets/images/page4_icon3.png" class="h-[50px]" />
            <div class="text-[18px] item-title mt-[16px] mb-[8px]">低成本及易用的开发环境</div>
            <div class="text-[14px] text-[#596273]">通过简单的API即可访问弹性的计算资源,无需购置昂贵的硬件设备也能获得强大的计算能力,极大降低了开发使用的成本门槛。</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script lang='ts' setup>
import { ref } from "vue";
import { onMounted, onUnmounted } from "vue";
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import Header from "./components/Header.vue";
import fullpage from 'fullpage.js';
import { useRouter } from "vue-router";
const isScroll = ref(false)
const myFullpage = ref()
const router = useRouter()
onMounted(() => {
  myFullpage.value = new fullpage('#fullpage', {
    //options here
    autoScrolling: true,
    scrollHorizontally: true,
    onLeave: function (origin, destination, direction) {
      if (destination.isFirst && (direction === 'up' || direction === 'down')) {
        isScroll.value = false
      } else {
        isScroll.value = true
      }
    },
  });
})

onUnmounted(() => {
  myFullpage.value.destroy('all');
})
</script>
<style lang='less' scoped>
.main-content-first {
  height: 100vh;
  background: url('../../assets/images/page1_bg.png') 100% center no-repeat;
  background-size: cover;
}

.main-content-two {
  height: 100vh;
  background: url('../../assets/images/page2_bg2.png') 100% center no-repeat;
  background-size: cover;
}

.main-content-three {
  height: 100vh;
  background: url('../../assets/images/page3_bg.png') 100% center no-repeat;
  background-size: cover;
}

.main-content-four {
  height: 100vh;
  background: url('../../assets/images/page4_bg.png') 100% center no-repeat;
  background-size: cover;
}

.item-css {
  box-shadow: 0px 5px 15px 0px rgba(182, 184, 212, 0.13);
}

.item-title {
  background: linear-gradient(to right, #30A4F2, #2554FC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.scroll-css {
  background-color: rgba(255, 255, 255, 0.4);
}
</style>