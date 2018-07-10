dataModels.sys_Event = {
  id:"1861da6b-fbaf-461c-8b58-bd9a38f089ce",
  name:"sys_Event",
  idFieldName:"id",
  fields:{
    id:{
      id:"a61103a3-20ff-4dbf-a902-5f6291ca436a",
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
    category:{
      id:"01f2cfe6-53e2-4448-83be-6731aea118b7",
      name:"category",
      displayName:"类型",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"list",
      inputHelpName:"system.inputhelp.eventCategory",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      maps:{"category":"name"},
      list:{
        name:"system.inputhelp.eventCategory",
        columns:[{field:"name",valueType:valueType.string,title:"名称",width:50,hidden:false},
{field:"description",valueType:valueType.string,title:"描述",width:100,hidden:false}
        ]
      },
      isReadonly:false
    },
    resultValueType:{
      id:"c3b4d61b-c79d-4578-8cae-bd0bb5b66a26",
      name:"resultValueType",
      displayName:"表达式返回值类型",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"list",
      inputHelpName:"sys.inputhelp.expressionValueType",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      maps:{"resultValueType":"name"},
      list:{
        name:"sys.inputhelp.expressionValueType",
        columns:[{field:"name",valueType:valueType.string,title:"名称",width:100,hidden:false}
        ]
      },
      isReadonly:false
    },
    description:{
      id:"b409fa0e-756b-49b4-9ac3-bd4a221adb47",
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
    name:{
      id:"37c09e81-1538-49cc-94e6-7484705f4113",
      name:"name",
      displayName:"名称",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    }
  }
}
