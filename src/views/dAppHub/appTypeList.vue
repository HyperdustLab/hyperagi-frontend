<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleOpen">
      <el-menu-item v-for="(item, index) in appTypeList" :key="index" :index="item.id">{{ item.name }}</el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, onBeforeMount, ref } from 'vue'
import api from '@/utils/api'

const emit = defineEmits(['open'])

const appTypeList = ref([{ id: '', name: 'All' }])

const activeIndex = ref('')

onBeforeMount(async () => {
  const { result } = await api.get('/mgn/appType/list', { pageSize: -1, column: 'orderNum', order: 'asc' })

  appTypeList.value.push(...result.records)

  const filterList = appTypeList.value.filter((item) => item.def === 'Y')

  if (filterList.length > 0) {
    activeIndex.value = filterList[0].id
  }
})

function handleOpen(index) {
  emit('open', index)
}
</script>

<style lang="scss" scoped>
::v-deep .el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 0px solid var(--el-menu-active-color);
  color: var(--el-menu-active-color) !important;
}

::v-deep .el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: #39b357c4;
  color: #39b357c4 !important;
}
</style>
