dataModels.sys_DataField = {
  id:"2",
  name:"sys_DataField",
  idFieldName:"id",
  fields:{
    inputhelpname:{
      id:"17",
      name:"inputhelpname",
      displayName:"输入帮助名称",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    issave:{
      id:"15",
      name:"issave",
      displayName:"是否保存",
      valueType:valueType.boolean,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1,
      decimalNum:0,
      isReadonly:false
    },
    foreignkeyname:{
      id:"18",
      name:"foreignkeyname",
      displayName:"同组外键字段",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    decimalnum:{
      id:"20",
      name:"decimalnum",
      displayName:"小数位数",
      valueType:valueType.decimal,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:2,
      decimalNum:0,
      isReadonly:false
    },
    parentid:{
      id:"12",
      name:"parentid",
      displayName:"parentid",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"none",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:10,
      decimalNum:0,
      isReadonly:false
    },
    datapurviewfactor:{
      id:"527",
      name:"datapurviewfactor",
      displayName:"数据权限要素",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    id:{
      id:"10",
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
    valuetype:{
      id:"14",
      name:"valuetype",
      displayName:"值类型",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"list",
      inputHelpName:"sys.inputhelp.valuetype",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      maps:{"valuetype":"name"},
      list:{
        name:"sys.inputhelp.valuetype",
        columns:[{field:"name",valueType:valueType.string,title:"类型",width:100,hidden:false}
        ]
      },
      isReadonly:false
    },
    isreadonly:{
      id:"22",
      name:"isreadonly",
      displayName:"是否只读",
      valueType:valueType.boolean,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1,
      decimalNum:0,
      isReadonly:false
    },
    inputhelptype:{
      id:"16",
      name:"inputhelptype",
      displayName:"输入帮助类型",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"list",
      inputHelpName:"sys.inputhelp.inputhelptype",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      maps:{"inputhelptype":"name"},
      list:{
        name:"sys.inputhelp.inputhelptype",
        columns:[{field:"name",valueType:valueType.string,title:"类型",width:100,hidden:false}
        ]
      },
      isReadonly:false
    },
    description:{
      id:"11",
      name:"description",
      displayName:"描述",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:255,
      decimalNum:0,
      isReadonly:false
    },
    name:{
      id:"9",
      name:"name",
      displayName:"字段名",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    issum:{
      id:"23",
      name:"issum",
      displayName:"是否合计",
      valueType:valueType.boolean,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1,
      decimalNum:0,
      isReadonly:false
    },
    valuelength:{
      id:"19",
      name:"valuelength",
      displayName:"字段长度",
      valueType:valueType.decimal,
      isSave:true,
      inputHelpType:"input",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:4,
      decimalNum:0,
      isReadonly:false
    },
    displayname:{
      id:"13",
      name:"displayname",
      displayName:"显示名",
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
