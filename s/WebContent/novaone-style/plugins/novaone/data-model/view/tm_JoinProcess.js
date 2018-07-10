viewModels.tm_JoinProcess = {
  id:"cbcbf06c-a0e5-449f-ab4e-302402a3d4a3",
  name:"tm_JoinProcess",
  dataName:"tm_JoinProcess",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"joinusercode", label:"账号", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"joinuserid", label:"joinuserid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"joinusername", label:"姓名", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"message", label:"留言", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"requestime", label:"申请时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"", dispunitType:""},
    {name:"teamid", label:"teamid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"joinusercode", label:"账号", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"joinuserid", label:"joinuserid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"joinusername", label:"姓名", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"message", label:"留言", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"requestime", label:"申请时间", editable:false,nullable:false, hidden:false, dispunitType:"", },
    {name:"teamid", label:"teamid", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
