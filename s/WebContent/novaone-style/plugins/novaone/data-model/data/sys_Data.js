dataModels.sys_Data = {
  id:"1",
  name:"sys_Data",
  idFieldName:"id",
  fields:{
    id:{
      id:"1",
      name:"id",
      displayName:"id",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"none",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:10,
      decimalNum:0,
      isReadonly:true
    },
    dstype:{
      id:"4",
      name:"dstype",
      displayName:"数据源类型",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"list",
      inputHelpName:"sys.inputhelp.dstype",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      maps:{"dstype":"name"},
      list:{
        name:"sys.inputhelp.dstype",
        columns:[{field:"name",valueType:valueType.string,title:"类型",width:100,hidden:false}
        ]
      },
      isReadonly:false
    },
    sysmodule:{
      id:"240",
      name:"sysmodule",
      displayName:"所属模块",
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
    idfieldname:{
      id:"239",
      name:"idfieldname",
      displayName:"id字段",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"null",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    dsexp:{
      id:"5",
      name:"dsexp",
      displayName:"数据源表达式",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:500,
      decimalNum:0,
      isReadonly:false
    },
    description:{
      id:"3",
      name:"description",
      displayName:"描述",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:100,
      decimalNum:0,
      isReadonly:false
    },
    name:{
      id:"2",
      name:"name",
      displayName:"名称",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      isReadonly:false
    },
    isusing:{
      id:"8",
      name:"isusing",
      displayName:"是否启用",
      valueType:valueType.boolean,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1,
      decimalNum:0,
      isReadonly:false
    },
    savetype:{
      id:"6",
      name:"savetype",
      displayName:"保存地类型",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"list",
      inputHelpName:"sys.inputhelp.savetype",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      maps:{"savetype":"name"},
      list:{
        name:"sys.inputhelp.savetype",
        columns:[{field:"name",valueType:valueType.string,title:"类型",width:100,hidden:false}
        ]
      },
      isReadonly:false
    },
    savedest:{
      id:"7",
      name:"savedest",
      displayName:"保存地名称",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:50,
      decimalNum:0,
      isReadonly:false
    }
  }
}
