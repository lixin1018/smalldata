viewModels.dm_ImportExportField = {
  id:"fe9f373f-7be2-4e36-b41a-40e40ee80cb3",
  name:"dm_ImportExportField",
  dataName:"dm_ImportExportField",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"versionid", label:"versionid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"showname", label:"显示名", width:100, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sourcecolumnname", label:"源列名", width:100, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sourcedatatype", label:"源数据类型", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sourceformatpattern", label:"源格式", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"dbfieldname", label:"数据库字段名", width:100, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"dbfieldtype", label:"数据库字段类型", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"dbwidth", label:"最大长度", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"dbfractionlength", label:"小数位数", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"dbisunique", label:"是否唯一", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"dbcanquery", label:"允许查询", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"columnindex", label:"序号", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"displaywidth", label:"显示宽度", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"versionid", label:"versionid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"showname", label:"显示名", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"sourcecolumnname", label:"源列名", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"sourcedatatype", label:"源数据类型", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"sourceformatpattern", label:"源格式", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"dbfieldname", label:"数据库字段名", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"dbfieldtype", label:"数据库字段类型", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"dbwidth", label:"最大长度", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"dbfractionlength", label:"小数位数", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"dbisunique", label:"是否唯一", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"dbcanquery", label:"允许查询", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"columnindex", label:"序号", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"displaywidth", label:"显示宽度", editable:true,nullable:false, hidden:false, dispunitType:"decimal", }
  ]
}
