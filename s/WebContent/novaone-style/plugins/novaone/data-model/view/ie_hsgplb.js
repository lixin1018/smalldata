viewModels.ie_hsgplb = {
  id:"1005c1cf-aa4e-4527-bac0-3a9f66bdfbc7",
  name:"ie_hsgplb",
  dataName:"ie_hsgplb",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"dm", label:"代码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"pysx", label:"拼音缩写", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"mc", label:"名称", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"zzjgid", label:"组织机构ID", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"lx", label:"类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"jys", label:"交易所", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"记录创建时间", width:0, hidden:true, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"isdeleted", label:"已删除", width:50, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"dm", label:"代码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"pysx", label:"拼音缩写", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"mc", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"zzjgid", label:"组织机构ID", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"lx", label:"类型", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"jys", label:"交易所", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"id", label:"ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"记录创建时间", editable:true,nullable:true, hidden:true, dispunitType:"time", },
    {name:"isdeleted", label:"已删除", editable:true,nullable:true, hidden:true, dispunitType:"checkbox", }
  ]
}
