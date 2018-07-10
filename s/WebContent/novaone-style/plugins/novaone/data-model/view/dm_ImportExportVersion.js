viewModels.dm_ImportExportVersion = {
  id:"4bb5ac36-3fb4-440f-a87f-dbb6c4617c38",
  name:"dm_ImportExportVersion",
  dataName:"dm_ImportExportVersion",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"code", label:"版本编码", width:100, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"filepath", label:"文件路径", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createuserid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createusername", label:"创建人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"definitionid", label:"definitionid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"已启用", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"sourcedatafiletype", label:"数据源文件类型", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sourcedatahasheaderrow", label:"数据源文件是否包含标题行", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"code", label:"版本编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"filepath", label:"文件路径", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createuserid", label:"创建人id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createusername", label:"创建人", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"definitionid", label:"definitionid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"isactive", label:"已启用", editable:false,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"sourcedatafiletype", label:"数据源文件类型", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"sourcedatahasheaderrow", label:"数据源文件是否包含标题行", editable:true,nullable:false, hidden:true, dispunitType:"checkbox", }
  ]
}
