viewModels.sys_View = {
  id:"1",
  name:"sys_View",
  dataName:"sys_View",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:10, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"dataname", label:"数据模型", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sysmodule", label:"所属模块", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"list"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"dataname", label:"数据模型", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"sysmodule", label:"所属模块", editable:true,nullable:true, hidden:false, dispunitType:"list", }
  ]
}
