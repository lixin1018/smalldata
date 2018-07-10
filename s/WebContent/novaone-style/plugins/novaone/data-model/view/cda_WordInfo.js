viewModels.cda_WordInfo = {
  id:"5636a14f-dea4-475a-9a86-9f9fab860ce6",
  name:"cda_WordInfo",
  dataName:"cda_WordInfo",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"wordtext", label:"词汇文本", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"typename", label:"类型名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"typeid", label:"类型id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:400, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"wordtext", label:"词汇文本", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"typename", label:"类型名称", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"typeid", label:"类型id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
