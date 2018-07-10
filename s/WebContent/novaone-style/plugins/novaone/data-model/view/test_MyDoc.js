viewModels.test_MyDoc = {
  id:"3146102d-4eb9-4610-832d-8e1fb73b369e",
  name:"test_MyDoc",
  dataName:"test_MyDoc",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"allprice", label:"总价", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"orgid", label:"组织ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"orgname", label:"组织", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"userid", label:"创建人ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"username", label:"创建人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:true,nullable:true, hidden:false, dispunitType:"time", },
    {name:"allprice", label:"总价", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"orgid", label:"组织ID", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"orgname", label:"组织", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"userid", label:"创建人ID", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"username", label:"创建人", editable:true,nullable:false, hidden:false, dispunitType:"pop", }
  ]
}
