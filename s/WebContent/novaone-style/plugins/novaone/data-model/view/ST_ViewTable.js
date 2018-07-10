viewModels.ST_ViewTable = {
  id:"8df11f60-347a-4b10-9f59-202a09008f56",
  name:"ST_ViewTable",
  dataName:"ST_ViewTable",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"excelTitileLineCount", label:"对应Excel标题行数目", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"parentViewTableCode", label:"父表编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"receiptDefinition_Id", label:"receiptDefinition_Id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"excelTitileLineCount", label:"对应Excel标题行数目", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"parentViewTableCode", label:"父表编码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"receiptDefinition_Id", label:"receiptDefinition_Id", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
