viewModels.d_Org = {
  id:"105",
  name:"d_Org",
  dataName:"d_Org",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"partcode", label:"本级编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isleaf", label:"是否也节点", width:50, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"partcode", label:"本级编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isleaf", label:"是否也节点", editable:false,nullable:false, hidden:true, dispunitType:"checkbox", }
  ]
}
