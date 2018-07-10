viewModels.grab_mapresult = {
  id:"38d5c4a9-6c29-439d-8add-daacb4d8e3af",
  name:"grab_mapresult",
  dataName:"grab_mapresult",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"code", label:"编码", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"begintime", label:"抓取开始时间", width:140, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"endtime", label:"抓取完成时间", width:140, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"grabtype", label:"抓取方式", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"rowcount", label:"总行数", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"grabuser", label:"抓取人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"grabuser_id", label:"抓取人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"code", label:"编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"begintime", label:"抓取开始时间", editable:true,nullable:false, hidden:false, dispunitType:"time", },
    {name:"endtime", label:"抓取完成时间", editable:true,nullable:false, hidden:false, dispunitType:"time", },
    {name:"grabtype", label:"抓取方式", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"rowcount", label:"总行数", editable:false,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"grabuser", label:"抓取人", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"grabuser_id", label:"抓取人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"id", label:"id", editable:true,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
