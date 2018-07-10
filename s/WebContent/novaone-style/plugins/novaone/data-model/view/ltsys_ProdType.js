viewModels.ltsys_ProdType = {
  id:"a197ae7d-4e95-4664-8234-ab0233668ffc",
  name:"ltsys_ProdType",
  dataName:"ltsys_ProdType",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"modify_time", label:"修改时间", width:160, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"isleaf", label:"是否叶节点", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"parent_id", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"ID", editable:false,dispunitType:"text", },
    {name:"code", label:"编码", editable:true,dispunitType:"text", },
    {name:"name", label:"名称", editable:true,dispunitType:"text", },
    {name:"description", label:"描述", editable:true,dispunitType:"text", },
    {name:"modify_time", label:"修改时间", editable:false,dispunitType:"time", },
    {name:"isleaf", label:"是否叶节点", editable:false,dispunitType:"checkbox", },
    {name:"parent_id", label:"parentid", editable:false,dispunitType:"text", }
  ]
}
