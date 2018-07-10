viewModels.tm_TeamMember = {
  id:"f6179b85-a728-4651-b932-98bbdd181ca4",
  name:"tm_TeamMember",
  dataName:"tm_TeamMember",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"memberid", label:"成员Id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"membercode", label:"成员编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"姓名", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"teamid", label:"团队Id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"memberid", label:"成员Id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"membercode", label:"成员编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"姓名", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"teamid", label:"团队Id", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
