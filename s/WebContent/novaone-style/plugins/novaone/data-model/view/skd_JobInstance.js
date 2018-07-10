viewModels.skd_JobInstance = {
  id:"b1714ad0-9c7f-4889-9cbe-cd7de664bc30",
  name:"skd_JobInstance",
  dataName:"skd_JobInstance",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"jobname", label:"任务名", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"jobid", label:"jobid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"plantime", label:"计划执行时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"runtime", label:"执行时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"endtime", label:"结束时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"statusname", label:"状态", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"note", label:"备注", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"jobname", label:"任务名", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"jobid", label:"jobid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:true,nullable:false, hidden:false, dispunitType:"time", },
    {name:"plantime", label:"计划执行时间", editable:true,nullable:false, hidden:false, dispunitType:"time", },
    {name:"runtime", label:"执行时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"endtime", label:"结束时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"statusname", label:"状态", editable:false,nullable:false, hidden:false, dispunitType:"list", },
    {name:"note", label:"备注", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
