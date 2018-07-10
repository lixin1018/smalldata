viewModels.dm_ImportDefinition = {
  id:"4bb5ac36-3fb4-440f-a87f-dbb6c4617c38",
  name:"dm_ImportDefinition",
  dataName:"dm_ImportDefinition",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"code", label:"编码", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"definitionxml", label:"定义", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ownerid", label:"所有者ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ownercode", label:"所有者编码", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ownername", label:"所有者", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"moduleid", label:"所属模块id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modulename", label:"所属模块", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"list"}
  ],
  dispUnitModel:[
    {name:"code", label:"编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"definitionxml", label:"定义", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"ownerid", label:"所有者ID", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"ownercode", label:"所有者编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"ownername", label:"所有者", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"moduleid", label:"所属模块id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"modulename", label:"所属模块", editable:true,nullable:true, hidden:false, dispunitType:"list", }
  ]
}
