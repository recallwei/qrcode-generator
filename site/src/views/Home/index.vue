<script setup lang="ts">
import { useRouter } from "vue-router"
import { NButton } from "naive-ui"
import { siteMetaData } from "@/constants"

const { AppName, Favicon, Version } = siteMetaData

const router = useRouter()

const navToQuick = () => router.push("/quick")
</script>

<template>
  <main class="h-full w-full select-none">
    <div class="absolute inset-0 bottom-28 m-auto flex flex-col items-center justify-center gap-4">
      <img
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
      <n-button
        type="primary"
        strong
        @click="navToQuick"
      >
        开始
      </n-button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.img-animation {
  animation: fall 1.5s 0s 1 forwards;
}

.pulse-animation {
  animation: pulse 2s linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-300px);
    animation-timing-function: ease-in;
  }
  30% {
    transform: translateY(-200px);
    animation-timing-function: ease-in;
  }
  60% {
    transform: translateY(-100px);
    animation-timing-function: ease-in;
  }
  80% {
    transform: translateY(-40px);
    animation-timing-function: ease-in;
  }
  96% {
    transform: translateY(5px);
    animation-timing-function: ease-in;
  }
  15%,
  45%,
  70%,
  88%,
  100% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.75;
  }
}
</style>
