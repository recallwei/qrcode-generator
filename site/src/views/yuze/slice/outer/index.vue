<script setup lang="ts">
import { ref } from "vue"
import { NTabs, NTabPane, NDynamicInput, NInput } from "naive-ui"

// 1 - 水煮胶 2 - 粘棒板 3 - 粘棒胶（辅料用）
// 4 - 金刚线 5 - 主辊
// 6 - 切割液（切片）
// 7 - 脱胶剂（脱胶）
// 8 - 清洗剂 9 - 双氧水 10 - 氢氧化钠（清洗）

type KV = {
  key: string | number
  value: string | number
}

const customModel = ref([
  {
    key: "",
    value: ""
  }
])

const customModelJsonString = ref("")

const onCreatePair = () => ({
  key: "",
  value: ""
})

const onUpdateCustomModel = (value: any) => {
  customModel.value = value
  const obj: Record<string, any> = {}
  try {
    customModel.value.forEach((item: KV) => {
      if (Object.prototype.hasOwnProperty.call(obj, item.key)) {
        throw new Error("重复的key")
      }
      obj[item.key] = item.value
    })
  } catch (err) {
    customModelJsonString.value = ""
  }
  customModelJsonString.value = JSON.stringify(obj, null, 2)
}
</script>

<template>
  <main>
    <n-tabs
      type="line"
      animated
    >
      <n-tab-pane
        name="自定义"
        tab="自定义"
      >
        <div class="w-3/5">
          <n-dynamic-input
            v-model:value="customModel"
            class="my-2"
            :on-create="onCreatePair"
            :on-update:value="onUpdateCustomModel"
          >
            <template #create-button-default> 添加键值对 </template>
            <template #default="{ value }">
              <div class="flex w-full items-center justify-between gap-2">
                <n-input
                  v-model:value="value.key"
                  type="text"
                />
                <n-input
                  v-model:value="value.value"
                  type="text"
                />
              </div>
            </template>
          </n-dynamic-input>
          <pre class="py-2">{{ customModelJsonString }}</pre>
        </div>
      </n-tab-pane>
      <n-tab-pane
        name="水煮胶"
        tab="水煮胶"
      >
        水煮胶
      </n-tab-pane>
      <n-tab-pane
        name="粘棒板"
        tab="粘棒板"
      >
        粘棒板
      </n-tab-pane>
      <n-tab-pane
        name="粘棒胶"
        tab="粘棒胶"
      >
        粘棒胶
      </n-tab-pane>
      <n-tab-pane
        name="金刚线"
        tab="金刚线"
      >
        金刚线
      </n-tab-pane>
      <n-tab-pane
        name="主辊"
        tab="主辊"
      >
        主辊
      </n-tab-pane>
      <n-tab-pane
        name="切割液"
        tab="切割液"
      >
        切割液
      </n-tab-pane>
      <n-tab-pane
        name="清洗剂"
        tab="清洗剂"
      >
        清洗剂
      </n-tab-pane>
      <n-tab-pane
        name="双氧水"
        tab="双氧水"
      >
        双氧水
      </n-tab-pane>
      <n-tab-pane
        name="氢氧化钠"
        tab="氢氧化钠"
      >
        氢氧化钠
      </n-tab-pane>
    </n-tabs>
  </main>
</template>

<style scoped lang="scss"></style>
