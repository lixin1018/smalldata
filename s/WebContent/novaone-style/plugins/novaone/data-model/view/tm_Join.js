viewModels.tm_Join = {
  id:"68132005-0eb8-45dc-8528-9761c3d7cdd4",
  name:"tm_Join",
  dataName:"tm_Join",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"joinuserid", label:"申请人id", width:0, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"joinusercode", label:"账号", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"joinusername", label:"姓名", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"requesttime", label:"申请时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"processtime", label:"处理时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"status", label:"状态", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"processuserid", label:"处理人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"message", label:"备注", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"joinuserid", label:"申请人id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"joinusercode", label:"账号", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"joinusername", label:"姓名", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"requesttime", label:"申请时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"processtime", label:"处理时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"status", label:"状态", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"processuserid", label:"处理人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"message", label:"备注", editable:false,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
