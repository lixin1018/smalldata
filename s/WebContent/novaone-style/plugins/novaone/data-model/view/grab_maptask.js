viewModels.grab_maptask = {
  id:"cef39333-bb14-414e-9e50-b406523fe416",
  name:"grab_maptask",
  dataName:"grab_maptask",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parameters", label:"参数", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"grabtype", label:"抓取类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"createuser", label:"创建人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"createuser_id", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:140, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifyuser", label:"修改人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"modifyuser_id", label:"修改人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"modifytime", label:"修改时间", width:140, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"parameters", label:"参数", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"grabtype", label:"抓取类型", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"createuser", label:"创建人", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"createuser_id", label:"创建人id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifyuser", label:"修改人", editable:false,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"modifyuser_id", label:"修改人id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", }
  ]
}
