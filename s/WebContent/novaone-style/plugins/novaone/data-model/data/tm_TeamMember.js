dataModels.tm_TeamMember = {
  id:"ec607e08-2db6-41d4-aeee-230891c6e745",
  name:"tm_TeamMember",
  idFieldName:"id",
  fields:{
    id:{
      id:"d10aa5b2-23c7-4458-804d-34cd21e8c802",
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
    teamid:{
      id:"2088a957-e405-4e6a-8f83-2208d98ecddb",
      name:"teamid",
      displayName:"团队Id",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      isReadonly:false
    },
    memberid:{
      id:"f05ad082-35b0-403f-a832-c1a0467770de",
      name:"memberid",
      displayName:"成员用户Id",
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
      id:"32ef7e3c-91f8-4a95-80ac-36a088a24dbf",
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
      id:"8f89f2c0-1d5b-4dfe-a314-075c522bf13e",
      name:"name",
      displayName:"姓名",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      maps:{"membercode":"code","membername":"name","memberid":"id"},
      isReadonly:false
    },
    ismanager:{
      id:"467c2019-17ab-49c2-bba6-a26ef67a39d3",
      name:"ismanager",
      displayName:"是否为管理员",
      valueType:valueType.boolean,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1,
      decimalNum:0,
      isReadonly:false
    },
    membercode:{
      id:"f6fc25fd-db2b-486c-b1e0-621d34f3ddd6",
      name:"membercode",
      displayName:"成员编码",
      valueType:valueType.string,
      isSave:false,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      isReadonly:false
    }
  }
}
