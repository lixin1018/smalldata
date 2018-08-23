viewModels.ie_jz_mzzdb = {
  id:"127f63f2-2f6e-4b3d-8f93-5a35919efad0",
  name:"ie_jz_mzzdb",
  dataName:"ie_jz_mzzdb",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"xh", label:"序号", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"bm", label:"编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"mz", label:"民族", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"记录创建时间", width:0, hidden:true, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"isdeleted", label:"已删除", width:50, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"xh", label:"序号", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"bm", label:"编码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"mz", label:"民族", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"id", label:"ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"记录创建时间", editable:true,nullable:true, hidden:true, dispunitType:"time", },
    {name:"isdeleted", label:"已删除", editable:true,nullable:true, hidden:true, dispunitType:"checkbox", }
  ]
}
