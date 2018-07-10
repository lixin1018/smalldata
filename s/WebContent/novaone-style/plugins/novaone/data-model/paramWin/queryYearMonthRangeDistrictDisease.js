paramWinModels.queryYearMonthRangeDistrictDisease = {
  id:11,
  name:"queryYearMonthRangeDistrictDisease",
  units:{
    diseaseName:{
      id:70,
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
      maps:{"diseaseId":"id","diseaseName":"name","diseaseCode":"code"},
      list:{
        name:"crb.baseData.disease",
        columns:[{field:"id",valueType:valueType.decimal,title:"id",width:0,hidden:true},
{field:"name",valueType:valueType.string,title:"名称",width:150,hidden:false},
{field:"code",valueType:valueType.string,title:"编码",width:0,hidden:true}
        ]
      },
      defaultValue:"合计",
    },
    districtName:{
      id:68,
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
      defaultValue:"",
    },
    yearValueS:{
      id:63,
      name:"yearValueS",
      label:"开始年份",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.year",
      decimalNum:"0",
      valueLength:4,
      isMultiValue:false,
      isNullable:false,
      unitType:"list",
      maps:{"yearValueS":"value"},
      list:{
        name:"crb.baseData.year",
        columns:[{field:"value",valueType:valueType.string,title:"年份",width:100,hidden:false}
        ]
      },
      defaultValue:"2013",
    },
    diseaseId:{
      id:69,
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
    monthValueS:{
      id:64,
      name:"monthValueS",
      label:"开始月份",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.month",
      decimalNum:"0",
      valueLength:2,
      isMultiValue:false,
      isNullable:false,
      unitType:"list",
      maps:{"monthValueS":"value"},
      list:{
        name:"crb.baseData.month",
        columns:[{field:"value",valueType:valueType.string,title:"月份",width:100,hidden:false}
        ]
      },
      defaultValue:"01",
    },
    diseaseCode:{
      id:74,
      name:"diseaseCode",
      label:"传染病编码",
      valueType:valueType.string,
      inputHelpType:"",
      inputHelpName:"",
      decimalNum:"0",
      valueLength:20,
      isMultiValue:false,
      isNullable:true,
      unitType:"text",
      defaultValue:"hj",
    },
    yearValueE:{
      id:65,
      name:"yearValueE",
      label:"截止年份",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.year",
      decimalNum:"0",
      valueLength:4,
      isMultiValue:false,
      isNullable:false,
      unitType:"list",
      maps:{"yearValueE":"value"},
      list:{
        name:"crb.baseData.year",
        columns:[{field:"value",valueType:valueType.string,title:"年份",width:100,hidden:false}
        ]
      },
      defaultValue:"2013",
    },
    districtCodePre:{
      id:67,
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
    },
    monthValueE:{
      id:66,
      name:"monthValueE",
      label:"截止月份",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.month",
      decimalNum:"0",
      valueLength:2,
      isMultiValue:false,
      isNullable:false,
      unitType:"list",
      maps:{"monthValueE":"value"},
      list:{
        name:"crb.baseData.month",
        columns:[{field:"value",valueType:valueType.string,title:"月份",width:100,hidden:false}
        ]
      },
      defaultValue:"06",
    }
  }
}
