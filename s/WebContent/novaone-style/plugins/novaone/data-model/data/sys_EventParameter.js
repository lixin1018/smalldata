dataModels.sys_EventParameter = {
  id:"5b4c861b-b262-4a43-a771-12fc68aeb940",
  name:"sys_EventParameter",
  idFieldName:"id",
  fields:{
    id:{
      id:"47b4ab14-d2a5-437e-9ae7-a8d5d534862d",
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
    valuetype:{
      id:"a6fe1b93-c434-434f-bc26-b154bd6526da",
      name:"valuetype",
      displayName:"值类型",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"list",
      inputHelpName:"sys.inputhelp.expressionValueType",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      maps:{"valuetype":"name"},
      list:{
        name:"sys.inputhelp.expressionValueType",
        columns:[{field:"name",valueType:valueType.string,title:"名称",width:100,hidden:false}
        ]
      },
      isReadonly:false
    },
    description:{
      id:"29c336a5-08e6-46b6-92a6-05c8004aea96",
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
      id:"61d74a20-423e-4180-af77-d30263ec3dff",
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
    },
    parentid:{
      id:"1e056fbc-e998-46bc-b50c-7348d520bdfd",
      name:"parentid",
      displayName:"parentid",
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
