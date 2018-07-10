viewModels.eg_DefinitionVersion = {
  id:"47d77ebf-411c-41d8-9770-e3fa37ec4df2",
  name:"eg_DefinitionVersion",
  dataName:"eg_DefinitionVersion",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"filepath", label:"路径", width:300, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:120, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:120, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"description", label:"备注", width:400, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createuserid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"enable", label:"已启用", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"createusername", label:"创建人", width:80, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"definitionid", label:"definitionId", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modifyuserid", label:"修改人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modifyusername", label:"修改人", width:80, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"filepath", label:"路径", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"description", label:"备注", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createuserid", label:"创建人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"enable", label:"已启用", editable:false,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"createusername", label:"创建人", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"definitionid", label:"definitionId", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"modifyuserid", label:"修改人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"modifyusername", label:"修改人", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
