<template>
  <div class="root">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>控制中心</el-breadcrumb-item>
      <el-breadcrumb-item>Honkai3RD 缓存管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <div class="tools-bar">
        <el-select v-model="cacheListForm.channel" placeholder="选择项目" @change="listCache">
          <el-option label="官服" value="official"></el-option>
          <el-option label="哔哩" value="bilibili"></el-option>
        </el-select>
        <el-button type="warning" @click="cacheEdit(null)">添加缓存</el-button>
      </div>

      <!-- 列表区 -->
      <el-table :data="cacheData" :default-sort="{prop: 'key', order: 'descending'}" stripe border>
        <el-table-column label="Key" prop="key" width="200px" sortable></el-table-column>
        <el-table-column label="Value" prop="value" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" width="65" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#2D5"
              inactive-color="#d21"
              @change="changeStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
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
              @click="delCache(scope.row)"
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
      :title="`${cacheSetForm.key} - 缓存编辑`"
      :visible.sync="cacheEditVisible"
      :close-on-click-modal="false"
      center
      :width="$utils.windowWidth() > 800 ? '70%' : '100%'"
      @close="closeDialog"
    >
      <el-row>
        <el-col :span="8">
          <el-input v-model="cacheSetForm.key" placeholder="Key"></el-input>
        </el-col>

        <el-col :offset="1" :span="8">
          <el-switch
            v-model="cacheSetForm.status"
            active-color="#0cc"
            active-text="激活"
            inactive-color="#d21"
            inactive-text="拉闸"
          ></el-switch>
        </el-col>

        <el-col :offset="1" :span="2">
          <div class="set-btns">
            <el-switch v-model="cacheSetForm.force" active-color="#2D5" inactive-color="#d21"></el-switch>
            <el-button type="danger" @click="setCache">更改</el-button>
          </div>
        </el-col>
      </el-row>

      <el-input type="textarea" v-model="cacheSetForm.value" :autosize="{ minRows: 15}"></el-input>
    </el-dialog>
  </div>
</template>

<script>
const Project = 'Honkai3RD'
export default {
  created() {
    if (!this.$utils.isEmpty(localStorage.hk_ps)) {
      this.cacheListForm.page_size = parseInt(localStorage.hk_ps)
    }
    this.listCache()
  },
  data() {
    return {
      // 缓存列表查询表单
      cacheListForm: {
        project: Project,
        channel: 'official',
        page_num: 1,
        page_size: 8
      },
      // 缓存设置表单
      cacheSetForm: {
        project: Project,
        channel: '',
        key: '',
        value: '',
        status: true,
        force: false
      },
      // 缓存删除表当
      cacheDelForm: {
        project: Project,
        channel: '',
        key: ''
      },
      // 缓存数据
      cacheData: [],
      // 查询总数
      total: 0,
      // 控制缓存编辑对话框的显示
      cacheEditVisible: false
    }
  },
  methods: {
    // 获取缓存列表
    listCache() {
      this.$API
        .cacheOtherlist(this.cacheListForm)
        .then(res => {
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

          // console.log(this.cacheData)
        })
        .catch(this.$API.error)
    },
    // 设置缓存
    setCache() {
      if (this.$utils.isEmpty(this.cacheSetForm.key)) return
      this.cacheSetForm.channel = this.cacheListForm.channel

      this.$API
        .cacheOtherSet(this.cacheSetForm)
        .then(res => {
          if (res.status !== 200) {
            return this.$notify.error({
              title: `设置失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          this.$message.success({
            message: res.msg,
            duration: 1500
          })
          this.listCache()
        })
        .catch(this.$API.error)
    },
    // 缓存状态改变
    changeStatus(cacheInfo) {
      this.cacheSetForm.channel = this.cacheListForm.channel
      this.cacheSetForm.key = cacheInfo.key
      this.cacheSetForm.value = cacheInfo.value
      this.cacheSetForm.status = cacheInfo.status
      this.cacheSetForm.force = true

      this.$API
        .cacheOtherSet(this.cacheSetForm)
        .then(res => {
          if (res.status !== 200) {
            cacheInfo.status = !cacheInfo.status
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
        })
        .catch(this.$API.error)
    },
    // 删除缓存
    delCache(row) {
      // console.log(row)

      this.$msgbox
        .confirm('红豆泥?', `删除缓存 - [${row.key}]`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        .then(() => {
          this.$API
            .cacheOtherDel({
              project: Project,
              channel: this.cacheListForm,
              key: row.key
            })
            .then(res => {
              if (res.status !== 200) {
                return this.$notify.error({
                  title: `删除失败(${res.status})`,
                  message: `错误信息: ${res.msg}`,
                  duration: 2000,
                  offset: 40
                })
              }

              this.$message.success({
                message: res.msg,
                duration: 1500
              })
              this.listCache()
            })
            .catch(this.$API.error)
        })
        .catch(() => {})
    },
    // 缓存编辑按钮事件
    cacheEdit(cacheInfo) {
      if (cacheInfo != null) {
        this.cacheSetForm.key = cacheInfo.key
        this.cacheSetForm.value = cacheInfo.value
        this.cacheSetForm.status = cacheInfo.status
      } else this.closeDialog()

      this.cacheEditVisible = true
    },
    // 关闭对话框事件
    closeDialog() {
      this.cacheSetForm = {
        project: Project,
        channel: '',
        key: '',
        value: '',
        status: true,
        force: false
      }
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.cacheListForm.page_size = localStorage.hk_ps = newSize
      this.listCache()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.cacheListForm.page_num = newPage
      this.listCache()
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  .tools-bar {
    .el-select {
      width: 150px;
      margin-right: 10px;
    }
  }
}

.el-dialog {
  .el-row {
    margin-bottom: 10px;
  }

  .el-switch {
    margin-top: 10px;
  }

  .set-btns {
    display: flex; /*Flex布局*/
    display: -webkit-flex; /* Safari */
    align-items: center; /*指定垂直居中*/

    .el-switch {
      margin-top: 0px;
    }

    .el-button {
      margin-left: 20px;
    }
  }
}
</style>
