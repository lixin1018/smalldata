viewModels.fl_FileType = {
  id:"019b8be2-3648-4ce1-9798-3338c6230a82",
  name:"fl_FileType",
  dataName:"fl_FileType",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"启用", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"allowcreateindir", label:"允许在文件夹中创建", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"canpreview", label:"支持预览", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"启用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"allowcreateindir", label:"允许在文件夹中创建", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"canpreview", label:"支持预览", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
