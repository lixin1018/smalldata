viewModels.tm_MyTeam = {
  id:"73708015-a184-469d-88bd-d04f2f60b503",
  name:"tm_MyTeam",
  dataName:"tm_MyTeam",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"teamcode", label:"团队编码", width:0, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"teamname", label:"名称", width:300, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createusername", label:"创建人", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createusercode", label:"创建人账号", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createuserid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"memberid", label:"memberid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"teamid", label:"团队id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"shareurl", label:"分享链接", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"teamcode", label:"团队编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"teamname", label:"名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createusername", label:"创建人", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"description", label:"描述", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createusercode", label:"创建人账号", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"createuserid", label:"创建人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"memberid", label:"memberid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"teamid", label:"团队id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"shareurl", label:"分享链接", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
