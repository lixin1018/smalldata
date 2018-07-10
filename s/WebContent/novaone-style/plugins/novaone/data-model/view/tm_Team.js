viewModels.tm_Team = {
  id:"29676119-aa55-46a6-b30b-badccceac633",
  name:"tm_Team",
  dataName:"tm_Team",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"tradename", label:"所属行业", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"list"},
    {name:"tradetypeid", label:"所属行业Id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createuserid", label:"创建人Id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createusercode", label:"创建人编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createusername", label:"创建人", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"createtime", label:"创建时间", width:100, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"tradename", label:"所属行业", editable:true,nullable:true, hidden:false, dispunitType:"list", },
    {name:"tradetypeid", label:"所属行业Id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createuserid", label:"创建人Id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"createusercode", label:"创建人编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createusername", label:"创建人", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"createtime", label:"创建时间", editable:true,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
