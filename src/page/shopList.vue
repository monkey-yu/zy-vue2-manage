<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="销售量">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="店铺名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="店铺地址"
          prop="address">
        </el-table-column>
        <el-table-column
          label="店铺介绍"
          prop="description">
        </el-table-column>
        <el-table-column
          label="操作" width="200">
            <template slot-scope="scope">

                <el-button size="mini" plain @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                <el-button size="mini" plain @click="addFood(scope.$index,scope.row)">添加食品</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>

            </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="修改店铺信息"
      :visible.sync="dialogVisible"
      width="60%">

      <el-form :model="selectTable">
        <el-form-item label="店铺名称" label-width="100px">
          <el-input v-model="selectTable.name"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" label-width="100px">
          <!--<el-input v-model="selectTable.name"></el-input>-->
          <el-autocomplete
            v-model="address.address"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入地址"
            style="width: 100%;"
            @select="addressSelect"
          ></el-autocomplete>
          <span>当前城市：{{city.name}}</span>
        </el-form-item>
        <el-form-item label="店铺介绍" label-width="100px">
          <el-input v-model="selectTable.description"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="100px">
          <el-input v-model="selectTable.phone"></el-input>
        </el-form-item>
        <el-form-item label="店铺分类" label-width="100px">
          <el-cascader
            :options="categoryOptions"
            v-model="selectedCategory"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <!-- 上传图片未完成 -->
        <el-form-item label="商铺图片" label-width="100px">
          <el-upload class="avatar-uploader" :action="'//elm.cangdu.org' + '/v1/addimg/shop'" :show-file-list ='false' :on-success="handleServiceAvatarScucess" :before-upload="beforeAvatarUpload">
            <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateShop">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import headTop from '../components/headTop';
  import {baseUrl, baseImgPath} from '@/config/env'

  import {cityGuess,getResturantsCount,getResturants,foodCategory,updateResturant,searchplace, deleteResturant} from '@/api/getData';
  export default {
    data(){
      return {
        tableData: [],
        city:{},
        count:0,
        currentPage:1,
        currentRow:null,
        offset:0,
        limit:20,
        dialogVisible:false,
        selectTable:{},
        address:{},
        selectedCategory: [],
        categoryOptions:[],
        baseImgPath,
        baseUrl


      }
    },
    components:{
      headTop
    },
    created(){
      this.initData();
    },
    methods:{
//      初始获取数据 city，count
      async initData(){
        try{
          this.city = await cityGuess();
          const countData = await getResturantsCount();
          if(countData.status == 1){
            this.count = countData.count;
          }else{
            throw new error('获取数据失败')
          }
          this.getResturants();

        }catch(err){
          console.log('获取数据失败',err);
        }
      },
//      修改每页数量
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      // 修改页码重新获取数据
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.offset = (val -1)* this.limit;
        this.getResturants()
      },
//      获取餐厅数据
      async getResturants(){
        const {latitude, longitude} = this.city;
        const restaurants = await getResturants({latitude, longitude, offset: this.offset, limit: this.limit});
        this.tableData = [];
        restaurants.forEach( item =>{
          const eachData = {};
          eachData.name = item.name;
          eachData.address = item.address;
          eachData.description = item.description;
          eachData.id = item.id;
          eachData.phone = item.phone;
          eachData.rating = item.rating;
          eachData.recent_order_num = item.recent_order_num;
          eachData.category = item.category;
          eachData.image_path = item.image_path;
          this.tableData.push(eachData);

        })
      },
      // 点击编辑
      handleEdit(index, row){
        this.selectTable = row;
        this.address.address = row.address;
        this.dialogVisible =true;
        this.selectedCategory = row.category.split('/');
        if(!this.categoryOptions.length){
          this.getCategory();
        }
      },
      // 获取分类的所有数据，并处理数据为 二维数组
      async getCategory(){
        try{
          const categories = await foodCategory();
          categories.forEach( item =>{
            if(item.sub_categories.length){
              const addnew ={
                value:item.name,
                label:item.name,
                children:[]
              }
              item.sub_categories.forEach( (subitem,index) =>{
                if(index == 0){
                  return
                }
                addnew.children.push({
                  value:subitem.name,
                  label:subitem.name
                })

              })
              this.categoryOptions.push(addnew)
            }
          })

        }catch(err){
          console.log('获取商铺种类失败', err);

        }
      },
      addressSelect(vale){
        const {address, latitude, longitude} = vale;
        this.address = {address, latitude, longitude};
      },
//      上传图片
      handleServiceAvatarScucess(res,file){
        if (res.status == 1) {
          this.selectTable.image_path = res.image_path;
        }else{
          this.$message.error('上传图片失败！');
        }
      },
//      判断上传图片大小 处理
      beforeAvatarUpload(file) {
        const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isRightType) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isRightType && isLt2M;
      },
//      点击确认 保存数据
      async updateShop(){
        this.dialogVisible = false;
        try{
          Object.assign(this.selectTable, this.address);
          this.selectTable.category = this.selectedCategory.join('/');
          const res = await updateResturant(this.selectTable)
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '更新店铺信息成功'
            });
            this.getResturants();
          }else{
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        }catch(err){
          console.log('更新餐馆信息失败', err);
        }
      },
      async querySearchAsync(queryString, cb) {
        if (queryString) {
          try{
            const cityList = await searchplace(this.city.id, queryString);
            if (cityList instanceof Array) {
              cityList.map(item => {
                item.value = item.address;
                return item;
              })
              cb(cityList)
            }
          }catch(err){
            console.log(err)
          }
        }
      },
      addFood(index, row){
        this.$router.push({ path: 'addGoods', query: { restaurant_id: row.id }})
      },
      async handleDelete(index, row) {
        try{
          const res = await deleteResturant(row.id);
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '删除店铺成功'
            });
            this.tableData.splice(index, 1);
          }else{
            throw new Error(res.message)
          }
        }catch(err){
          this.$message({
            type: 'error',
            message: err.message
          });
          console.log('删除店铺失败')
        }
      },

    }
  }
</script>

<style lang="less">
  @import '../style/mixin';
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .table_container{
    padding: 20px;
  }
  .Pagination{
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
