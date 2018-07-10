viewModels.ltsys_ValueType = {
  id:"db0e7574-3e61-4bcb-bc06-d6a8bbd612a3",
  name:"ltsys_ValueType",
  dataName:"ltsys_ValueType",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"id", label:"Id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"modify_time", label:"修改时间", width:160, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", formatter:timeFormater, dispunitType:"time"}
  ],
  dispUnitModel:[
    {name:"id", label:"Id", editable:false,dispunitType:"text", },
    {name:"code", label:"编码", editable:true,dispunitType:"text", },
    {name:"name", label:"名称", editable:true,dispunitType:"text", },
    {name:"description", label:"描述", editable:true,dispunitType:"text", },
    {name:"modify_time", label:"修改时间", editable:false,dispunitType:"time", }
  ]
}
