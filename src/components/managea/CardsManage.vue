<template>
  <div class="root">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营中心</el-breadcrumb-item>
      <el-breadcrumb-item>卡密管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索栏区 -->
      <div class="query">
        <el-select v-model="cardsListForm.project" @change="listCards">
          <el-option label="所有项目" value></el-option>
          <el-option label="崩坏3" value="Honkai3RD"></el-option>
          <el-option label="明日方舟" value="Arknights"></el-option>
        </el-select>
        <el-select v-model="cardsListForm.level" @change="listCards">
          <el-option label="所有版本" :value="0"></el-option>
          <el-option label="珀金版" :value="3"></el-option>
          <el-option label="黄金版" :value="2"></el-option>
          <el-option label="青铜版" :value="1"></el-option>
        </el-select>
        <el-select v-model="cardsListForm.time" @change="listCards">
          <el-option label="所有时效" :value="0"></el-option>
          <el-option label="年卡" :value="7"></el-option>
          <el-option label="半年" :value="6"></el-option>
          <el-option label="季卡" :value="5"></el-option>
          <el-option label="月卡" :value="4"></el-option>
          <el-option label="周卡" :value="3"></el-option>
          <el-option label="天卡" :value="2"></el-option>
          <el-option label="时卡" :value="1"></el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          v-model="cardsListForm.creator"
          clearable
          @clear="clearInput('creator')"
        >
          <template slot="prepend">
            <b>创建者</b>
          </template>
        </el-input>
        <el-input
          placeholder="请输入内容"
          v-model="cardsListForm.cdkey"
          clearable
          @clear="clearInput('cdkey')"
        >
          <template slot="prepend">
            <b>卡密</b>
          </template>
        </el-input>
        <el-input
          placeholder="请输入内容"
          v-model="cardsListForm.using"
          clearable
          @clear="clearInput('using_user')"
        >
          <template slot="prepend">
            <b>使用者</b>
          </template>
        </el-input>
        <el-button icon="el-icon-search" type="primary" @click="listCards"></el-button>
        <el-button icon="el-icon-s-ticket" type="danger" @click="createCardsVisible = true"></el-button>
      </div>

      <!-- 列表区 -->
      <el-table :data="cards" stripe border>
        <el-table-column label="ID" prop="id" width="45" :resizable="false" align="center"></el-table-column>
        <el-table-column
          label="创建日期"
          prop="created_at"
          width="160"
          :resizable="false"
          align="center"
        ></el-table-column>
        <el-table-column label="项目名" width="100" prop="project" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建者" width="150" prop="creator" show-overflow-tooltip></el-table-column>
        <el-table-column label="级别" width="80" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.level === 3" effect="plain">
              <b>{{$utils.formatCardsLevel(scope.row.level)}}</b>
            </el-tag>
            <el-tag type="warning" v-if="scope.row.level === 2" effect="plain">
              <b>{{$utils.formatCardsLevel(scope.row.level)}}</b>
            </el-tag>
            <el-tag v-if="scope.row.level === 1" effect="plain">
              <b>{{$utils.formatCardsLevel(scope.row.level)}}</b>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时效" width="70" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.time >= 5" effect="dark">
              <b>{{$utils.formatCardsTime(scope.row.time)}}</b>
            </el-tag>
            <el-tag type="warning" v-if="scope.row.time === 4" effect="dark">
              <b>{{$utils.formatCardsTime(scope.row.time)}}</b>
            </el-tag>
            <el-tag type="success" v-if="scope.row.time === 3" effect="dark">
              <b>{{$utils.formatCardsTime(scope.row.time)}}</b>
            </el-tag>
            <el-tag v-if="scope.row.time === 2" effect="dark">
              <b>{{$utils.formatCardsTime(scope.row.time)}}</b>
            </el-tag>
            <el-tag type="info" v-if="scope.row.time === 1" effect="dark">
              <b>{{$utils.formatCardsTime(scope.row.time)}}</b>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="卡密" header-align="center">
          <template slot-scope="scope">
            <div class="cdk">
              <el-tooltip content="复制" :enterable="false" :disabled="scope.$index > 0">
                <el-button
                  icon="iconfont icon-zhihangfankui"
                  type="info"
                  size="mini"
                  v-clipboard:copy="scope.row.cdkey"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                ></el-button>
              </el-tooltip>
              <el-input
                type="textarea"
                :autosize="{ maxRows: 1}"
                :value="scope.row.cdkey"
                :maxlength="4096"
                show-word-limit
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="使用者" width="150" prop="using_user" show-overflow-tooltip></el-table-column>
        <el-table-column label="激活日期" prop="using_at" width="160" :resizable="false" align="center"></el-table-column>
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
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cardsListForm.page_num"
        :page-sizes="[5, 8, 15, 20, 50, 100]"
        :page-size="cardsListForm.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 时效编辑对话框 -->
    <el-dialog
      title="创建卡密"
      :visible.sync="createCardsVisible"
      center
      :width="$utils.windowWidth() > 800 ? '70%' : '100%'"
      @close="cleanCreateCards"
      class="create-cards"
    >
      <!-- 项目选择器 -->
      <div>
        <el-select v-model="cardsCreateForm.project" placeholder="选择项目">
          <el-option label="崩坏3" value="Honkai3RD"></el-option>
          <el-option label="明日方舟" value="Arknights"></el-option>
        </el-select>
      </div>

      <div class="select">
        <!-- 卡密级别选择器 -->
        <el-select v-model="cardsCreateForm.level">
          <el-option label="请选择级别" :value="0" disabled></el-option>
          <el-option label="珀金版" :value="3"></el-option>
          <el-option label="黄金版" :value="2"></el-option>
          <el-option label="青铜版" :value="1"></el-option>
        </el-select>

        <!-- 卡密时效选择器 -->
        <el-select v-model="cardsCreateForm.time">
          <el-option label="请选择时效" :value="0" disabled></el-option>
          <el-option label="年卡" :value="7"></el-option>
          <el-option label="半年" :value="6"></el-option>
          <el-option label="季卡" :value="5"></el-option>
          <el-option label="月卡" :value="4"></el-option>
          <el-option label="周卡" :value="3"></el-option>
          <el-option label="天卡" :value="2"></el-option>
          <el-option label="时卡" :value="1"></el-option>
        </el-select>
      </div>

      <!-- 卡密创建数量 -->
      <div>
        <el-progress type="dashboard" :percentage="cardsCreateForm.number" :color="colors"></el-progress>

        <div class="nuberBtns" v-if="$utils.windowWidth() > 750">
          <el-button type="warning" @click="addNumber(10)">+10</el-button>
          <el-button type="primary" @click="addNumber(5)">+05</el-button>
          <el-button type="success" @click="addNumber(1)">+01</el-button>
          <el-button type="success" @click="subNumber(1)">-01</el-button>
          <el-button type="primary" @click="subNumber(5)">-05</el-button>
          <el-button type="warning" @click="subNumber(10)">-10</el-button>
        </div>
        <template v-else>
          <div class="nuberBtns">
            <el-button type="success" @click="addNumber(1)">+01</el-button>
            <el-button type="success" @click="subNumber(1)">-01</el-button>
          </div>
          <div class="nuberBtns">
            <el-button type="primary" @click="addNumber(5)">+05</el-button>
            <el-button type="primary" @click="subNumber(5)">-05</el-button>
          </div>
          <div class="nuberBtns">
            <el-button type="warning" @click="addNumber(10)">+10</el-button>
            <el-button type="warning" @click="subNumber(10)">-10</el-button>
          </div>
        </template>
      </div>

      <div>
        <el-button type="info" @click="cleanCreateCards">清空</el-button>
        <el-button type="danger" @click="createCards">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    if (!this.$utils.isEmpty(localStorage.cl_ps)) {
      this.cardsListForm.page_size = parseInt(localStorage.cl_ps)
    }
    this.listCards()
  },
  data() {
    return {
      // 卡密列表查询表单
      cardsListForm: {
        project: '',
        creator: '',
        level: 0,
        time: 0,
        cdkey: '',
        using: 'null',
        page_num: 1,
        page_size: 8
      },
      // 卡密创建表单
      cardsCreateForm: {
        project: '',
        number: 0,
        level: 0,
        time: 0
      },
      // 查询总数
      total: 0,
      // 卡密列表
      cards: [],
      // 控制卡密创建对话框的显示
      createCardsVisible: false,
      // 颜色列表
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  methods: {
    // 获取卡密列表
    listCards() {
      this.$API
        .cardsList(this.cardsListForm)
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
          this.cards = res.data.items
        })
        .catch(this.$API.error)
    },
    // 更改卡密状态
    changeStatus(card) {
      this.$API
        .cardsChangeStatus({ id: card.id, status: card.status })
        .then(res => {
          if (res.status !== 200) {
            card.status = !card.status
            return this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          this.$message.success({
            message: res.msg,
            duration: 1500
          })
        })
        .catch(this.$API.error)
    },
    // 创建卡密
    createCards() {
      if (this.$utils.isEmpty(this.cardsCreateForm.project)) return
      if (this.cardsCreateForm.number === 0) return
      if (this.cardsCreateForm.level === 0) return
      if (this.cardsCreateForm.time === 0) return

      this.$API
        .cardsCreate(this.cardsCreateForm)
        .then(res => {
          if (res.status !== 200) {
            return this.$notify.error({
              title: `操作失败(${res.status})`,
              message: `错误信息: ${res.msg}`,
              duration: 2000,
              offset: 40
            })
          }

          // 创建成功
          this.$message.success({
            message: '创建成功',
            duration: 1500
          })
          this.listCards()
          this.createCardsVisible = false
        })
        .catch(this.$API.error)
    },
    // 清空输入框
    clearInput(field) {
      this.cardsListForm[field] = ''
      this.listCards()
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.cardsListForm.page_size = localStorage.cl_ps = newSize
      this.listCards()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.cardsListForm.page_num = newPage
      this.listCards()
    },
    // 添加数量按钮事件
    addNumber(number) {
      this.cardsCreateForm.number += number
      if (this.cardsCreateForm.number > 100) this.cardsCreateForm.number = 100
    },
    // 减少数量按钮事件
    subNumber(number) {
      this.cardsCreateForm.number -= number
      if (this.cardsCreateForm.number < 0) this.cardsCreateForm.number = 0
    },
    // 清空卡密创建表单
    cleanCreateCards() {
      this.cardsCreateForm = {
        project: '',
        number: 0,
        level: 0,
        time: 0
      }
    },
    // 复制成功事件
    onCopy() {
      this.$message.success({
        message: '复制成功',
        duration: 1000
      })
    },
    // 复制失败事件
    onError() {
      this.$message.success({
        message: '复制失败',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="less" scoped>
.query {
  .el-select {
    width: 105px;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .el-input {
    width: 250px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.cdk {
  display: flex; /*Flex布局*/
  display: -webkit-flex; /* Safari */
  align-items: center; /*指定垂直居中*/

  .el-tooltip {
    margin-right: 10px;
  }
}

.create-cards {
  div {
    text-align: center;
    margin-bottom: 10px;
  }

  .el-select {
    width: 150px;
  }

  .select {
    .el-select {
      width: 130px;
      margin-right: 15px;
    }
  }

  .nuberBtns {
    display: block;
    margin: 0 auto;
    margin-bottom: 5px;
    .el-button {
      width: 70px;
    }
  }
}
</style>
