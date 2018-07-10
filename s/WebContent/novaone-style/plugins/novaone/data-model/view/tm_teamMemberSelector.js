viewModels.tm_teamMemberSelector = {
  id:"841c8179-0eb9-4f8f-891e-68a5ff867c33",
  name:"tm_teamMemberSelector",
  dataName:"tm_teamMemberSelector",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"usercode", label:"编码", width:100, hidden:true, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"username", label:"姓名", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"用户id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"email", label:"Email", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"usercode", label:"编码", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"username", label:"姓名", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"userid", label:"用户id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"email", label:"Email", editable:false,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
