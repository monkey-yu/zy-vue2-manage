<template>
  <div>
    <!--<head-top></head-top>-->
    <section class="data_section">
      <header class="section_title">数据统计</header>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="4"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{userCount}}</span> 新增用户</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{orderCount}}</span> 新增订单</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{adminCount}}</span> 新增管理员</div></el-col>

      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="4"><div class="data_list today_head"><span class="data_num head">总数据：</span></div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{allUserCount}}</span> 注册用户</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{allOrderCount}}</span> 订单</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{allAdminCount}}</span> 管理员</div></el-col>

      </el-row>
    </section>
    <!--<tendency :sevenDate="sevenDate" :sevenDay="sevenDay"></tendency>-->
  </div>
</template>


<script>
  import dtime from 'time-formater'
  import {userCount,orderCount,adminCount,allUserCount,allOrderCount,allAdminCount} from '@/api/getData';

  export default{
    data(){
      return {
        userCount:null,
        orderCount:null,
        adminCount:null,
        allUserCount:null,
        allOrderCount:null,
        allAdminCount:null,
        sevenDate:[],
        sevenDay:[[],[],[]]
      }
    },
    components:{

    },
    mounted(){
      this.initData();
    },
    computed:{

    },
    methods:{
      async initData(){
        const today = dtime().format('YYYY-MM-DD');
        Promise.all([userCount(today),orderCount(today),adminCount(today),allUserCount(),allOrderCount(),allAdminCount()])
          .then(res=>{
              this.userCount= res[0].count;
              this.orderCount= res[1].count;
              this.adminCount= res[2].count;
              this.allUserCount= res[3].count;
              this.allOrderCount= res[4].count;
              this.allAdminCount= res[5].count;

          })
          .catch(err => console.log(err))
      }
    }
  }
</script>


<style lang="less">
  @import '../style/mixin';
  .data_section{
    padding: 20px;
    margin-bottom: 40px;
    .section_title{
      text-align: center;
      font-size: 30px;
      margin-bottom: 10px;
    }
    .data_list{
      text-align: center;
      font-size: 14px;
      color: #666;
      border-radius: 6px;
      background: #E5E9F2;
      .data_num{
        color: #333;
        font-size: 26px;

      }
      .head{
        border-radius: 6px;
        font-size: 22px;
        padding: 4px 0;
        color: #fff;
        display: inline-block;
      }
    }
    .today_head{
      background: #FF9800;
    }
    .all_head{
      background: #20A0FF;
    }
  }
  .wan{
    .sc(16px, #333)
  }
</style>

