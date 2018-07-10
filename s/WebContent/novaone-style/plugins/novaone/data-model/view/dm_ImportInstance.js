viewModels.dm_ImportInstance = {
  id:"79dcd889-04e2-4790-bea5-6f645ea49b2c",
  name:"dm_ImportInstance",
  dataName:"dm_ImportInstance",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"filename", label:"文件名", width:220, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"totalnum", label:"文件记录数", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"succeednum", label:"已导入记录数", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"statustype", label:"状态", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:130, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:130, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"loginfo", label:"日志", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"desttablename", label:"目标表", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"definitioncode", label:"导入定义编码", width:130, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"definitionid", label:"definitionid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"definitionversioncode", label:"导入定义版本编码", width:130, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"definitionversionid", label:"definitionversionid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"filename", label:"文件名", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"totalnum", label:"文件记录数", editable:false,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"succeednum", label:"已导入记录数", editable:false,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"statustype", label:"状态", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"loginfo", label:"日志", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"desttablename", label:"目标表", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"definitioncode", label:"导入定义编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"definitionid", label:"definitionid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"definitionversioncode", label:"导入定义版本编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"definitionversionid", label:"definitionversionid", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
