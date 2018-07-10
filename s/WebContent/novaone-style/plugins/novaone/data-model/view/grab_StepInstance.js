viewModels.grab_StepInstance = {
  id:"4692eddc-507a-40ad-ad57-cc0342f00e19",
  name:"grab_StepInstance",
  dataName:"grab_StepInstance",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"runindex", label:"执行顺序", width:60, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"projectname", label:"项目名称", width:150, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"groupname", label:"分组名称", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"statustype", label:"状态", width:80, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"starttime", label:"开始时间", width:100, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"endtime", label:"结束时间", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"parameters", label:"参数", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"listfilepath", label:"列表文件路径", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"inputdir", label:"输入目录", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"middledir", label:"中间目录", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"outputdir", label:"输出目录", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"message", label:"信息", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"taskinstanceid", label:"taskinstanceid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"runindex", label:"执行顺序", editable:false,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"projectname", label:"项目名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"groupname", label:"分组名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"statustype", label:"状态", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"starttime", label:"开始时间", editable:false,nullable:false, hidden:true, dispunitType:"time", },
    {name:"endtime", label:"结束时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"parameters", label:"参数", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"listfilepath", label:"列表文件路径", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"inputdir", label:"输入目录", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"middledir", label:"中间目录", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"outputdir", label:"输出目录", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"message", label:"信息", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"taskinstanceid", label:"taskinstanceid", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
