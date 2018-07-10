viewModels.d_UserMessage = {
  id:"bc3fcbaa-3b2a-418c-8cd1-4e574e1e8057",
  name:"d_UserMessage",
  dataName:"d_UserMessage",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"content", label:"内容", width:500, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"touserid", label:"收信人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"fromuserid", label:"发信人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"发送时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"tousercode", label:"收信人账号", width:100, hidden:true, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"tousername", label:"收信人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"fromusercode", label:"发信人账号", width:100, hidden:true, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"fromusername", label:"发信人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"备注", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"content", label:"内容", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"touserid", label:"收信人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"fromuserid", label:"发信人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"发送时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"tousercode", label:"收信人账号", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"tousername", label:"收信人", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"fromusercode", label:"发信人账号", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"fromusername", label:"发信人", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"备注", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
