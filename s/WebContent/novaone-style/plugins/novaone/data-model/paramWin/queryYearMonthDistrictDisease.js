paramWinModels.queryYearMonthDistrictDisease = {
  id:6,
  name:"queryYearMonthDistrictDisease",
  units:{
    diseaseName:{
      id:32,
      name:"diseaseName",
      label:"传染病",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.disease",
      decimalNum:"0",
      valueLength:20,
      isMultiValue:false,
      isNullable:false,
      unitType:"list",
      maps:{"diseaseId":"id","diseaseName":"name"},
      list:{
        name:"crb.baseData.disease",
        columns:[{field:"id",valueType:valueType.decimal,title:"id",width:0,hidden:true},
{field:"name",valueType:valueType.string,title:"名称",width:150,hidden:false},
{field:"code",valueType:valueType.string,title:"编码",width:0,hidden:true}
        ]
      },
      defaultValue:"合计",
    },
    monthValue:{
      id:28,
      name:"monthValue",
      label:"月份",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.month",
      decimalNum:"0",
      valueLength:2,
      isMultiValue:false,
      isNullable:true,
      unitType:"list",
      maps:{"monthValue":"value"},
      list:{
        name:"crb.baseData.month",
        columns:[{field:"value",valueType:valueType.string,title:"月份",width:100,hidden:false}
        ]
      },
      defaultValue:"",
    },
    districtName:{
      id:30,
      name:"districtName",
      label:"地区",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.district",
      decimalNum:"0",
      valueLength:20,
      isMultiValue:false,
      isNullable:false,
      unitType:"list",
      maps:{"districtCodePre":"districtCodePre","districtName":"districtName"},
      list:{
        name:"crb.baseData.district",
        columns:[{field:"districtName",valueType:valueType.string,title:"地区",width:100,hidden:false},
{field:"districtCodePre",valueType:valueType.string,title:"地区编码前缀",width:0,hidden:true}
        ]
      },
      defaultValue:"全国",
    },
    diseaseId:{
      id:31,
      name:"diseaseId",
      label:"传染病Id",
      valueType:valueType.decimal,
      inputHelpType:"",
      inputHelpName:"",
      decimalNum:"0",
      valueLength:10,
      isMultiValue:false,
      isNullable:false,
      unitType:"decimal",
      defaultValue:"1",
    },
    yearValue:{
      id:27,
      name:"yearValue",
      label:"年份",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.year",
      decimalNum:"0",
      valueLength:4,
      isMultiValue:false,
      isNullable:false,
      unitType:"list",
      maps:{"yearValue":"value"},
      list:{
        name:"crb.baseData.year",
        columns:[{field:"value",valueType:valueType.string,title:"年份",width:100,hidden:false}
        ]
      },
      defaultValue:"2013",
    },
    districtCodePre:{
      id:29,
      name:"districtCodePre",
      label:"地区编码前缀",
      valueType:valueType.string,
      inputHelpType:"",
      inputHelpName:"",
      decimalNum:"0",
      valueLength:20,
      isMultiValue:false,
      isNullable:true,
      unitType:"text",
      defaultValue:"0",
    }
  }
}
