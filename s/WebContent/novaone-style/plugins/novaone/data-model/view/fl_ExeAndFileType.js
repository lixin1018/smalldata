viewModels.fl_ExeAndFileType = {
  id:"a44b6aea-8725-49b5-8253-6831e216b40b",
  name:"fl_ExeAndFileType",
  dataName:"fl_ExeAndFileType",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"exeid", label:"可执行程序id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"execode", label:"可执行程序", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"filetypeid", label:"文件类型id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"filetypecode", label:"文件类型", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"isactive", label:"启用", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"isdefault", label:"默认打开方式", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"exeid", label:"可执行程序id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"execode", label:"可执行程序", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"filetypeid", label:"文件类型id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"filetypecode", label:"文件类型", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"isactive", label:"启用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"isdefault", label:"默认打开方式", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", }
  ]
}
