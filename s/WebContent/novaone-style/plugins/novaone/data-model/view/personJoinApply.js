viewModels.personJoinApply = {
  id:"f102d4de-6efd-4ee2-9ee2-eaee3156a342",
  name:"personJoinApply",
  dataName:"personJoinApply",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"submittime", label:"申请时间", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"applystatetypeid", label:"申请状态ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"applystatetype", label:"申请状态", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"pprovince", label:"省", width:60, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"pcity", label:"市", width:60, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"pzone", label:"区县", width:60, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"pdistributors", label:"渠道商", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"pname", label:"名称", width:80, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"pphone", label:"电话", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"paddress", label:"地址", width:200, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"preferees", label:"推荐人", width:80, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"pqq", label:"QQ", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"pweixin", label:"微信", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"pemial", label:"邮箱", width:150, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"ID", editable:false,dispunitType:"text", },
    {name:"submittime", label:"申请时间", editable:false,dispunitType:"time", },
    {name:"applystatetypeid", label:"申请状态ID", editable:false,dispunitType:"text", },
    {name:"applystatetype", label:"申请状态", editable:false,dispunitType:"text", },
    {name:"pprovince", label:"省", editable:true,dispunitType:"text", },
    {name:"pcity", label:"市", editable:true,dispunitType:"text", },
    {name:"pzone", label:"区县", editable:true,dispunitType:"text", },
    {name:"pdistributors", label:"渠道商", editable:true,dispunitType:"text", },
    {name:"pname", label:"名称", editable:true,dispunitType:"text", },
    {name:"pphone", label:"电话", editable:true,dispunitType:"text", },
    {name:"paddress", label:"地址", editable:true,dispunitType:"text", },
    {name:"preferees", label:"推荐人", editable:true,dispunitType:"text", },
    {name:"pqq", label:"QQ", editable:true,dispunitType:"text", },
    {name:"pweixin", label:"微信", editable:true,dispunitType:"text", },
    {name:"pemial", label:"邮箱", editable:true,dispunitType:"text", }
  ]
}
