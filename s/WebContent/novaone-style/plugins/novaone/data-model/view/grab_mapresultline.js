viewModels.grab_mapresultline = {
  id:"b22acac6-dd11-4916-bf42-0b881d1b509b",
  name:"grab_mapresultline",
  dataName:"grab_mapresultline",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"positionx", label:"坐标X", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"positiony", label:"坐标Y", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"address", label:"地址", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"tel", label:"电话", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"others", label:"其它信息", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"positionx", label:"坐标X", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"positiony", label:"坐标Y", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"address", label:"地址", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"tel", label:"电话", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"others", label:"其它信息", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
