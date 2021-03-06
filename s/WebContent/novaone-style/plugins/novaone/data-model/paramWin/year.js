paramWinModels.year = {
  id:9,
  name:"year",
  units:{
    yearValue:{
      id:48,
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
    }
  }
}
