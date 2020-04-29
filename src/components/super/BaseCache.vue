<template>
  <div class="root">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>控制中心</el-breadcrumb-item>
      <el-breadcrumb-item>Base 缓存管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 工具栏 -->
      <el-button type="warning" @click="cacheEdit(null)">添加Base缓存</el-button>

      <!-- 列表区 -->
      <el-table
        :data="cacheData"
        :default-sort="{prop: 'space', order: 'descending'}"
        stripe
        border
      >
        <el-table-column label="Space" prop="space" width="200px" sortable></el-table-column>
        <el-table-column label="Key" prop="key" width="200px"></el-table-column>
        <el-table-column label="Value" prop="value" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" header-align="center" width="131" :resizable="false">
          <template slot-scope="scope">
            <el-button
              icon="iconfont icon-ceshishenqing"
              type="primary"
              size="mini"
              @click="cacheEdit(scope.row)"
            ></el-button>
            <el-button
              icon="iconfont icon-shanchu"
              type="danger"
              size="mini"
              @click="delBaseCache(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cacheListForm.page_num"
        :page-sizes="[5, 8, 15, 20, 50, 100]"
        :page-size="cacheListForm.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 缓存编辑对话框 -->
    <el-dialog
      :title="`Base:${cacheSetForm.space}:${cacheSetForm.key} - 缓存编辑`"
      :visible.sync="cacheEditVisible"
      :close-on-click-modal="false"
      center
      :width="$utils.windowWidth() > 800 ? '70%' : '100%'"
      @close="closeDialog"
    >
      <el-row>
        <el-col :span="8">
          <el-input v-model="cacheSetForm.space" placeholder="Space"></el-input>
        </el-col>

        <el-col :offset="1" :span="8">
          <el-input v-model="cacheSetForm.key" placeholder="Key"></el-input>
        </el-col>

        <el-col :offset="1" :span="2">
          <div class="set-btns">
            <el-switch v-model="cacheSetForm.force" active-color="#2D5" inactive-color="#d21"></el-switch>
            <el-button type="danger" @click="setBaseCache">更改</el-button>
          </div>
        </el-col>
      </el-row>

      <el-input type="textarea" v-model="cacheSetForm.value" :autosize="{ minRows: 15}"></el-input>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    if (!this.$utils.isEmpty(localStorage.bc_ps)) {
      this.cacheListForm.page_size = parseInt(localStorage.bc_ps)
    }
    this.listBaseCache()
  },
  data() {
    return {
      // 缓存列表查询表单
      cacheListForm: {
        page_num: 1,
        page_size: 5
      },
      // 缓存设置表当
      cacheSetForm: {
        space: '',
        key: '',
        value: '',
        force: false
      },
      // 缓存删除表当
      cacheDelForm: {
        space: '',
        key: ''
      },
      // base缓存数据
      cacheData: [],
      // 查询总数
      total: 0,
      // 控制缓存编辑对话框的显示
      cacheEditVisible: false
    }
  },
  methods: {
    // 获取Base缓存列表
    listBaseCache() {
      this.$API
        .cacheBaselist(this.cacheListForm)
        .then(res => {
          // 获取失败
          if (res.status !== 200) {
            return this.$notify.error({
              title: `获取失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          // 保存数据
          this.total = res.data.total
          this.cacheData = res.data.items
        })
        .catch(this.$API.error)
    },
    // 设置Base缓存
    setBaseCache() {
      if (this.$utils.isEmpty(this.cacheSetForm.space)) return
      if (this.$utils.isEmpty(this.cacheSetForm.key)) return

      this.$API
        .cacheBaseSet(this.cacheSetForm)
        .then(res => {
          if (res.status !== 200) {
            return this.$notify.error({
              title: `设置失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          // 成功
          this.$message.success({
            message: res.msg,
            duration: 1500
          })
          this.listBaseCache()
        })
        .catch(this.$API.error)
    },
    // 删除Base缓存
    delBaseCache(cacheInfo) {
      if (this.$utils.isEmpty(cacheInfo.space)) return
      if (this.$utils.isEmpty(cacheInfo.key)) return

      this.cacheDelForm.space = cacheInfo.space
      this.cacheDelForm.key = cacheInfo.key

      this.$msgbox
        .confirm(
          '红豆泥?',
          `删除缓存 - [Base:${this.cacheDelForm.space}:${this.cacheDelForm.key}]`,
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }
        )
        .then(() => {
          this.$API
            .cacheBaseDel(this.cacheDelForm)
            .then(res => {
              if (res.status !== 200) {
                return this.$notify.error({
                  title: `删除失败(${res.status})`,
                  message: `错误信息: ${res.msg}`,
                  duration: 2000,
                  offset: 40
                })
              }

              // 成功
              this.$message.success({
                message: res.msg,
                duration: 1500
              })
              this.listBaseCache()
            })
            .catch(this.$API.error)
        })
        .catch(() => {})
    },
    // 缓存编辑按钮事件
    cacheEdit(cacheInfo) {
      if (cacheInfo != null) {
        this.cacheSetForm.space = cacheInfo.space
        this.cacheSetForm.key = cacheInfo.key
        this.cacheSetForm.value = cacheInfo.value
      } else this.closeDialog()

      this.cacheEditVisible = true
    },
    // 关闭对话框事件
    closeDialog(flash) {
      this.cacheSetForm = {
        space: '',
        key: '',
        value: '',
        force: false
      }
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.cacheListForm.page_size = localStorage.bc_ps = newSize
      this.listBaseCache()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.cacheListForm.page_num = newPage
      this.listBaseCache()
    }
  }
}
</script>

<style lang="less" scoped>
.el-dialog {
  .el-row {
    margin-bottom: 10px;
  }

  .set-btns {
    display: flex; /*Flex布局*/
    display: -webkit-flex; /* Safari */
    align-items: center; /*指定垂直居中*/

    .el-button {
      margin-left: 20px;
    }
  }
}
</style>
