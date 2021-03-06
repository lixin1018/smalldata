dataModels.sys_View = {
  id:"4",
  name:"sys_View",
  idFieldName:"id",
  fields:{
    id:{
      id:"28",
      name:"id",
      displayName:"id",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"none",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:10,
      decimalNum:0,
      isReadonly:false
    },
    dataname:{
      id:"30",
      name:"dataname",
      displayName:"数据模型",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    sysmodule:{
      id:"241",
      name:"sysmodule",
      displayName:"模块",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"list",
      inputHelpName:"sys.model.moduletype",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      maps:{"sysmodule":"name"},
      list:{
        name:"sys.model.moduletype",
        columns:[{field:"name",valueType:valueType.string,title:"名称",width:100,hidden:false}
        ]
      },
      isReadonly:false
    },
    name:{
      id:"29",
      name:"name",
      displayName:"名称",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    }
  }
}
