dataModels.applyForJoinApprovecomment = {
  id:"7008abe0-ed96-4686-839f-7249c68b7473",
  name:"applyForJoinApprovecomment",
  idFieldName:"id",
  fields:{
    ApplyForJoinId:{
      id:"04404291-7d0e-45f2-8d73-c61d7ed02e12",
      name:"ApplyForJoinId",
      displayName:"申请单据ID",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    approveuser:{
      id:"7879d7a9-7395-410e-838c-09a7aea7e89d",
      name:"approveuser",
      displayName:"审批用户",
      valueType:valueType.string,
      isSave:false,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      isReadonly:false
    },
    id:{
      id:"409b846b-53d2-40f8-b7d5-1d7b1d198ef2",
      name:"id",
      displayName:"ID",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    approveuserid:{
      id:"804e98e1-5432-4db6-82b0-7ff8e53f630b",
      name:"approveuserid",
      displayName:"审批用户ID",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:40,
      decimalNum:0,
      isReadonly:false
    },
    approvetime:{
      id:"a561cf07-fb96-4fd2-82de-1e355d5eaeda",
      name:"approvetime",
      displayName:"审批时间",
      valueType:valueType.time,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:20,
      decimalNum:0,
      isReadonly:false
    },
    comment:{
      id:"5282fac2-9ea9-4817-bfca-d53d63a3b2e5",
      name:"comment",
      displayName:"审批回复",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:200,
      decimalNum:0,
      isReadonly:false
    },
    isapproved:{
      id:"e764a62c-0713-4fcc-a574-6fe99727e664",
      name:"isapproved",
      displayName:"审批通过",
      valueType:valueType.string,
      isSave:true,
      inputHelpType:"",
      inputHelpName:"",
      foreignKeyName:"",
      valueLength:1,
      decimalNum:0,
      isReadonly:false
    }
  }
}
