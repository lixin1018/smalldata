paramWinModels.queryYearDisease = {
  id:23,
  name:"queryYearDisease",
  units:{
    diseaseName:{
      id:147,
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
      maps:{"diseaseId":"id","diseaseCode":"code","diseaseName":"name"},
      list:{
        name:"crb.baseData.disease",
        columns:[{field:"id",valueType:valueType.decimal,title:"id",width:0,hidden:true},
{field:"name",valueType:valueType.string,title:"名称",width:150,hidden:false},
{field:"code",valueType:valueType.string,title:"编码",width:0,hidden:true}
        ]
      },
      defaultValue:"合计",
    },
    yearValueA:{
      id:145,
      name:"yearValueA",
      label:"开始年份",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.year",
      decimalNum:"0",
      valueLength:4,
      isMultiValue:false,
      isNullable:false,
      unitType:"list",
      maps:{"yearValueA":"value"},
      list:{
        name:"crb.baseData.year",
        columns:[{field:"value",valueType:valueType.string,title:"年份",width:100,hidden:false}
        ]
      },
      defaultValue:"2006",
    },
    yearValueB:{
      id:148,
      name:"yearValueB",
      label:"结束年份",
      valueType:valueType.string,
      inputHelpType:"list",
      inputHelpName:"crb.baseData.year",
      decimalNum:"0",
      valueLength:4,
      isMultiValue:false,
      isNullable:false,
      unitType:"list",
      maps:{"yearValueB":"value"},
      list:{
        name:"crb.baseData.year",
        columns:[{field:"value",valueType:valueType.string,title:"年份",width:100,hidden:false}
        ]
      },
      defaultValue:"2013",
    },
    diseaseId:{
      id:146,
      name:"diseaseId",
      label:"传染病Id",
      valueType:valueType.decimal,
      inputHelpType:"",
      inputHelpName:"",
      decimalNum:"0",
      valueLength:11,
      isMultiValue:false,
      isNullable:false,
      unitType:"decimal",
      defaultValue:"1",
    },
    diseaseCode:{
      id:149,
      name:"diseaseCode",
      label:"传染病编码",
      valueType:valueType.string,
      inputHelpType:"",
      inputHelpName:"",
      decimalNum:"0",
      valueLength:20,
      isMultiValue:false,
      isNullable:false,
      unitType:"text",
      defaultValue:"hj",
    }
  }
}
