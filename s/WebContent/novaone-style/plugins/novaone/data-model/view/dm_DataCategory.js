viewModels.dm_DataCategory = {
  id:"bd2f711b-f8d5-43a1-8273-cf09c69857cf",
  name:"dm_DataCategory",
  dataName:"dm_DataCategory",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"启用", width:50, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"showindex", label:"显示顺序", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"description", label:"描述", width:400, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"typeid", label:"typeid", width:0, hidden:true, sortable:false, search:true, resizable:false, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"typename", label:"分类方式", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"list"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"启用", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"showindex", label:"显示顺序", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"typeid", label:"typeid", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"typename", label:"分类方式", editable:true,nullable:false, hidden:false, dispunitType:"list", }
  ]
}
