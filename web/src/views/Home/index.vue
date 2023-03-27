<script setup lang="ts">
import { siteMetaData } from '@/constants'

const { AppName, Favicon, Version } = siteMetaData

const router = useRouter()

const [replayAnimationFlag, toggleReplayAnimationFlag] = useToggle(true)

const replayAnimationFlagGetter = computed(() => replayAnimationFlag.value.toString())

useEventListener(document, 'visibilitychange', () => {
  if (!document.hidden) {
    toggleReplayAnimationFlag()
  }
})

const navToQuick = () => router.push('/quick')
</script>

<template>
  <main class="h-full w-full select-none">
    <!--
      2023/3/25 Bruce Song <recall4056@gmail.com>
      NOTE:
      如果没有 Alert，该区域需要 class 属性 bottom-28
    -->
    <div class="absolute inset-0 m-auto flex flex-col items-center justify-center space-y-4">
      <img
        :key="replayAnimationFlagGetter"
        class="img-animation"
        width="120"
        height="120"
        :src="Favicon"
        :alt="AppName"
      />
      <span
        class="pulse-animation bg-gradient-to-r from-[#50c878] to-[#c4b5fd] bg-clip-text text-5xl font-medium text-transparent"
      >
        {{ AppName }}
      </span>
      <span class="text-lg">{{ Version }}</span>
      <NButton
        type="primary"
        strong
        @click="navToQuick"
      >
        开始
      </NButton>
      <NAlert
        title="注意："
        type="warning"
      >
        当前仍处于内测版本，版本升级可能会造成已生成的历史二维码丢失。
      </NAlert>
    </div>
  </main>
</template>

<style scoped lang="scss">
.img-animation {
  animation: fall-bounce 2s 0s 1 forwards;
}

.pulse-animation {
  animation: pulse 2s linear infinite;
}

@keyframes fall-bounce {
  0% {
    transform: translateY(-300px) rotate(0);
    animation-timing-function: ease-in;
  }
  15% {
    transform: translateY(0) rotate(60deg);
    animation-timing-function: ease-out;
  }
  30% {
    transform: translateY(-200px) rotate(120deg);
    animation-timing-function: ease-in;
  }
  45% {
    transform: translateY(0) rotate(180deg);
    animation-timing-function: ease-out;
  }
  60% {
    transform: translateY(-100px) rotate(240deg);
    animation-timing-function: ease-in;
  }
  70% {
    transform: translateY(0) rotate(300deg);
    animation-timing-function: ease-out;
  }
  80% {
    transform: translateY(-40px) rotate(320deg);
    animation-timing-function: ease-in;
  }
  90% {
    transform: translateY(0) rotate(340deg);
    animation-timing-function: ease-out;
  }
  100% {
    transform: translateY(0) rotate(360deg);
    animation-timing-function: ease-out;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.75;
  }
}
</style>
