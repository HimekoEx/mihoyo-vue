<template>
  <div class="root">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营中心</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索栏区 -->
      <div class="query">
        <el-select v-model="projectListForm.project">
          <el-option label="崩坏3" value="Honkai3RD"></el-option>
          <el-option label="明日方舟" value="Arknights"></el-option>
        </el-select>

        <el-input
          placeholder="请输入内容"
          v-model="projectListForm.user_name"
          clearable
          @clear="inputClear"
        >
          <template slot="prepend">
            <b>用户名</b>
          </template>
        </el-input>

        <el-input
          placeholder="请输入内容"
          v-model="projectListForm.qq_number"
          clearable
          @clear="inputClear"
        >
          <template slot="prepend">
            <b>QQ</b>
          </template>
        </el-input>

        <el-input
          placeholder="请输入内容"
          v-model="projectListForm.e_mail"
          clearable
          @clear="inputClear"
        >
          <template slot="prepend">
            <b>邮箱</b>
          </template>
        </el-input>

        <el-button icon="el-icon-search" type="primary" @click="listProject"></el-button>
      </div>

      <!-- 列表区 -->
      <el-table :data="projects" stripe border>
        <el-table-column label="ID" prop="id" width="45" :resizable="false"></el-table-column>
        <el-table-column label="用户名" prop="user_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="CDK" header-align="center">
          <template slot-scope="scope">
            <el-input type="textarea" :autosize="{ maxRows: 1}" :value="scope.row.current_card"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="时效" align="center" width="250" :resizable="false">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.expire_time"
              type="datetime"
              :clearable="false"
              @change="changeTime(scope.row)"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="UUID" header-align="center" width="360" :resizable="false">
          <template slot-scope="scope">
            <div class="group">
              <el-button
                icon="iconfont icon-shanchu"
                type="danger"
                size="mini"
                @click="cleanUID(scope.row,'UUID')"
              ></el-button>
              <el-input :value="scope.row.uuid"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="GUID" header-align="center" width="360" :resizable="false">
          <template slot-scope="scope">
            <div class="group">
              <el-button
                icon="iconfont icon-shanchu"
                type="warning"
                size="mini"
                @click="cleanUID(scope.row,'GUID')"
              ></el-button>
              <el-input :value="scope.row.guid"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="级别" align="center" width="135" :resizable="false">
          <template slot-scope="scope">
            <el-select v-model="scope.row.level" @change="changeLevel(scope.row)">
              <el-option
                v-for="item in table"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="projectListForm.page_num"
        :page-sizes="[5, 8, 15, 20, 50, 100]"
        :page-size="projectListForm.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    if (!this.$utils.isEmpty(localStorage.pl_ps)) {
      this.projectListForm.page_size = parseInt(localStorage.pl_ps)
    }
    this.listProject()
  },
  data() {
    return {
      // 项目列表查询表单
      projectListForm: {
        project: 'Honkai3RD',
        user_name: '',
        qq_number: '',
        e_mail: '',
        page_num: 1,
        page_size: 8
      },
      // 查询总数
      total: 0,
      // 子项目列表
      projects: [],
      table: [
        { value: 300, label: '铂金版' },
        { value: 200, label: '黄金版' },
        { value: 100, label: '青铜版' },
        { value: 0, label: '白嫖版' }
      ]
    }
  },
  methods: {
    // 查询项目
    listProject() {
      this.$API
        .usersCardsInfo(this.projectListForm)
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
          this.projects = res.data.items

          // 构建data对象
          this.projects.forEach(item => (item.expire_time *= 1000))
        })
        .catch(this.$API.error)
    },
    // 更改时效
    changeTime(pro) {
      this.$API
        .usersChangeTime({
          project: this.projectListForm.project,
          time: Date.parse(pro.expire_time) / 1000,
          id: pro.id
        })
        .then(res => {
          if (res.status !== 200) {
            this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
            return this.listProject()
          }

          this.$message.success({
            message: res.msg,
            duration: 1500
          })
        })
        .catch(this.$API.error)
    },
    // 清除UID
    cleanUID(row, tag) {
      this.$msgbox
        .confirm('红豆泥?', `清除[${row.user_name}] - ${tag}`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
        .then(() => {
          this.$API
            .usersCleanUID({
              project: this.projectListForm.project,
              uid: tag,
              id: row.id
            })
            .then(res => {
              if (res.status !== 200) {
                return this.$notify.error({
                  title: `操作失败(${res.status})`,
                  message: `错误信息: ${res.msg}`,
                  duration: 2000,
                  offset: 40
                })
              }

              this.$message.success({
                message: '操作成功',
                duration: 1500
              })
              this.listProject()
            })
            .catch(this.$API.error)
        })
        .catch(() => {})
    },
    // 更改级别
    changeLevel(row) {
      this.$API
        .usersChangeLevel({
          project: this.projectListForm.project,
          level: row.level,
          id: row.id
        })
        .then(res => {
          if (res.status !== 200) {
            this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
            return this.listProject()
          }

          this.$message.success({
            message: '操作成功',
            duration: 1500
          })
        })
        .catch(this.$API.error)
    },
    // 搜索框清空事件
    inputClear() {
      this.listProject()
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.projectListForm.page_size = localStorage.pl_ps = newSize
      this.listProject()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.projectListForm.page_num = newPage
      this.listProject()
    }
  }
}
</script>

<style lang="less" scoped>
.query {
  .el-select {
    width: 150px;
    margin-right: 10px;
  }
  .el-input {
    width: 250px;
    margin-right: 10px;
  }
}

.group {
  display: flex; /*Flex布局*/
  display: -webkit-flex; /* Safari */
  align-items: center; /*指定垂直居中*/

  .el-button {
    margin-right: 7px;
  }
}

.level {
  display: flex; /*Flex布局*/
  display: -webkit-flex; /* Safari */
  align-items: center; /*指定垂直居中*/

  .el-button {
    margin-left: 5px;
  }
}
</style>
