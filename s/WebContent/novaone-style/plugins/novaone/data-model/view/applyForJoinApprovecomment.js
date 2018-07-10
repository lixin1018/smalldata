viewModels.applyForJoinApprovecomment = {
  id:"3287a574-1c59-4963-a78d-29380c7bc73c",
  name:"applyForJoinApprovecomment",
  dataName:"applyForJoinApprovecomment",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"approvetime", label:"审批时间", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"approveuserid", label:"审批用户ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"approveuser", label:"审批用户", width:80, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"comment", label:"审批回复", width:200, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"isapproved", label:"是否通过", width:60, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"ApplyForJoinId", label:"申请ID", width:60, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"ID", editable:false,dispunitType:"text", },
    {name:"approvetime", label:"审批时间", editable:false,dispunitType:"time", },
    {name:"approveuserid", label:"审批用户ID", editable:false,dispunitType:"text", },
    {name:"approveuser", label:"审批用户", editable:false,dispunitType:"text", },
    {name:"comment", label:"审批回复", editable:false,dispunitType:"text", },
    {name:"isapproved", label:"是否通过", editable:false,dispunitType:"text", },
    {name:"ApplyForJoinId", label:"申请ID", editable:false,dispunitType:"text", }
  ]
}
