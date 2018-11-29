dataModels.eg_Definition = {
  id:"7fa7103a-3b0f-46fb-acc9-60241fd440d8",
  name:"eg_Definition",
  idFieldName:"id",
  fields:{
    createtime:{
      id:"5d7236dc-b50b-415e-a892-e3fc3d1def08",
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
    modifyuserid:{
      id:"0f25d047-5f97-420b-bbdc-486690d4dcdb",
      name:"modifyuserid",
      displayName:"修改人id",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    modifytime:{
      id:"7b6c6446-675d-4c48-9193-7e7e0bbb62f5",
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
    modifyusername:{
      id:"9057f9db-e218-4dc8-9323-885f6007f310",
      name:"modifyusername",
      displayName:"修改人",
      valueType:valueType.string,
      isSave:false,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    teamid:{
      id:"8743cf76-f5b5-49d4-9759-6ae8c555a56a",
      name:"teamid",
      displayName:"teamid",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    name:{
      id:"b066e4ad-7572-4bfb-af08-6060e2bd8cc8",
      name:"name",
      displayName:"名称",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1000,
      decimalNum:0,
      isReadonly:false
    },
    createuserid:{
      id:"0ad56370-c8ff-4638-b414-a0fbc5d37bdf",
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
    description:{
      id:"335c1afd-856b-420d-be33-de34fa31c458",
      name:"description",
      displayName:"描述",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1000,
      decimalNum:0,
      isReadonly:false
    },
    id:{
      id:"daaa7468-af7c-48b7-9da3-3e44def95302",
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
    isdeleted:{
      id:"ba967f41-b06a-47a0-907d-c514cb7598be",
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
    createusername:{
      id:"2db1059d-6907-4d84-bfc2-369eb346f5d1",
      name:"createusername",
      displayName:"创建人",
      valueType:valueType.string,
      isSave:false,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    teamname:{
      id:"e84c37e6-81cb-499b-bc4f-48d7791a04c5",
      name:"teamname",
      displayName:"团队",
      valueType:valueType.string,
      isSave:false,
      inputHelpType:"list",
      inputHelpName:"dataHelper.team.managerTeam",
      foreignKeyName:"teamid",
      valueLength:40,
      decimalNum:0,
      maps:{"teamid":"teamid","teamname":"teamname"},
      list:{
        name:"dataHelper.team.managerTeam",
        columns:[{field:"teamid",valueType:valueType.string,title:"teamid",width:0,hidden:true},
{field:"teamname",valueType:valueType.string,title:"团队名称",width:200,hidden:false},
{field:"memberid",valueType:valueType.string,title:"memberid",width:0,hidden:true}
        ]
      },
      isReadonly:false
    }
  }
}
