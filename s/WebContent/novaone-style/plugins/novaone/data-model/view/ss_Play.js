viewModels.ss_Play = {
  id:"de02e94a-6208-4652-a977-f8771634aa29",
  name:"ss_Play",
  dataName:"ss_Play",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"title", label:"标题", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"enable", label:"已启用", width:50, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"tag", label:"标签", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sortindex", label:"显示序号", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"title", label:"标题", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"enable", label:"已启用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"tag", label:"标签", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"sortindex", label:"显示序号", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"createtime", label:"创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", }
  ]
}
