viewModels.ie_test2 = {
  id:"2474489d-7ba8-4018-8b75-da34da30265b",
  name:"ie_test2",
  dataName:"ie_test2",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"name", label:"姓名", width:0, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"project", label:"项目名", width:0, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"startdate", label:"开始日期", width:0, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", formatter:dateFormater, dispunitType:"date"},
    {name:"workload", label:"工作量（人天）", width:0, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"记录创建时间", width:0, hidden:true, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"}
  ],
  dispUnitModel:[
    {name:"name", label:"姓名", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"project", label:"项目名", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"startdate", label:"开始日期", editable:true,nullable:true, hidden:false, dispunitType:"date", },
    {name:"workload", label:"工作量（人天）", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"id", label:"ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"记录创建时间", editable:true,nullable:true, hidden:true, dispunitType:"time", }
  ]
}
