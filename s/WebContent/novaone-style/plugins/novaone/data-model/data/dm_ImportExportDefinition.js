dataModels.dm_ImportExportDefinition = {
  id:"17aea2d1-9d52-4f57-a189-6dd6235dfc71",
  name:"dm_ImportExportDefinition",
  idFieldName:"id",
  fields:{
    autoupdatemodel:{
      id:"9f9f52b2-cd98-41dd-8a08-ab3132588709",
      name:"autoupdatemodel",
      displayName:"自动更新模型",
      valueType:valueType.boolean,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1,
      decimalNum:0,
      isReadonly:false
    },
    modifytime:{
      id:"91bf1fc0-f450-4098-b61b-2774ede23d51",
      name:"modifytime",
      displayName:"修改时间",
      valueType:valueType.time,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      isReadonly:false
    },
    id:{
      id:"6498fd3d-f44e-4def-80f1-7a7b934f1cab",
      name:"id",
      displayName:"id",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    createtime:{
      id:"00eec4d0-7c04-4d1b-b0a7-5e50dff76e1f",
      name:"createtime",
      displayName:"创建时间",
      valueType:valueType.time,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      isReadonly:false
    },
    unitprice:{
      id:"45d3936e-82e2-4004-9749-d118a7e8079d",
      name:"unitprice",
      displayName:"单价",
      valueType:valueType.decimal,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:10,
      decimalNum:6,
      isReadonly:false
    },
    createusername:{
      id:"42bb2773-32e2-4950-a4ea-9c2cd524b144",
      name:"createusername",
      displayName:"创建人",
      valueType:valueType.string,
      isSave:false,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      isReadonly:false
    },
    description:{
      id:"2cb38302-a82b-460e-ba2f-edb27f3da15d",
      name:"description",
      displayName:"描述",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:255,
      decimalNum:0,
      isReadonly:false
    },
    isdeleted:{
      id:"b05f796e-e7de-4aaa-b1ea-33c5e2ece7f8",
      name:"isdeleted",
      displayName:"已删除",
      valueType:valueType.boolean,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1,
      decimalNum:0,
      isReadonly:false
    },
    name:{
      id:"6623194d-c1e4-4be8-b757-3170b63e85c5",
      name:"name",
      displayName:"名称",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:255,
      decimalNum:0,
      isReadonly:false
    },
    createuserid:{
      id:"55ea5d1c-5ecb-49ad-bd1f-944c6c61bfb5",
      name:"createuserid",
      displayName:"创建人id",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    code:{
      id:"b14a17bf-6337-4822-a234-89417c6519fc",
      name:"code",
      displayName:"编码",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:100,
      decimalNum:0,
      isReadonly:false
    },
    dbtablename:{
      id:"f209c265-f7b7-4d5b-8b0a-6be11c721865",
      name:"dbtablename",
      displayName:"数据表名",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:255,
      decimalNum:0,
      isReadonly:false
    }
  }
}
