viewModels.dm_DataCategoryDataList = {
  id:"4548db55-5dd6-498e-b76f-d8e46f9b286f",
  name:"dm_DataCategoryDataList",
  dataName:"dm_DataCategoryDataList",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"definitionid", label:"definitionid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"showindex", label:"显示顺序", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"definitionname", label:"数据名称", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"启用", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"definitionid", label:"definitionid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"showindex", label:"显示顺序", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"definitionname", label:"数据名称", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"isactive", label:"启用", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", }
  ]
}
