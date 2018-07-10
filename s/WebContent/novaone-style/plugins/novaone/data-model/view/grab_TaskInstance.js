viewModels.grab_TaskInstance = {
  id:"7b0c0ffa-83be-4674-915b-49fd9d5aa2b8",
  name:"grab_TaskInstance",
  dataName:"grab_TaskInstance",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"statustype", label:"状态", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"level", label:"优先级", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"invokeid", label:"invokeid", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"grabserviceid", label:"抓取服务id", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"inserttime", label:"记录创建时间", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"statustype", label:"状态", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"level", label:"优先级", editable:false,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"description", label:"描述", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"invokeid", label:"invokeid", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"grabserviceid", label:"抓取服务id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"inserttime", label:"记录创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", }
  ]
}
