viewModels.skd_Job = {
  id:"036fc864-3095-41ec-b9e5-a8a1068565e2",
  name:"skd_Job",
  dataName:"skd_Job",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"runexp", label:"执行表达式", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"runparameters", label:"执行参数(暂未实现)", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"timeconfig", label:"执行时间配置", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"已启用", width:50, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"jobtype", label:"任务类型", width:80, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"jobtypeid", label:"任务类型id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"username", label:"创建人", width:70, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"createtime", label:"创建时间", width:100, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"runexp", label:"执行表达式", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"runparameters", label:"执行参数(暂未实现)", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"timeconfig", label:"执行时间配置", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"已启用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"jobtype", label:"任务类型", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"jobtypeid", label:"任务类型id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"userid", label:"创建人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"username", label:"创建人", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"createtime", label:"创建时间", editable:true,nullable:false, hidden:false, dispunitType:"time", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
