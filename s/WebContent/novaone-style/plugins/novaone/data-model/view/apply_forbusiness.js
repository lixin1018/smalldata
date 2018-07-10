viewModels.apply_forbusiness = {
  id:"1e268617-8888-4f26-b62f-2eda268f2517",
  name:"apply_forbusiness",
  dataName:"apply_forbusiness",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"ispass", label:"是否通过", width:80, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"applybusinessid", label:"申请服务ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"applybusiness", label:"申请服务", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"realname", label:"姓名", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"telephone", label:"电话号", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"storename", label:"店铺名", width:150, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"storeaddress", label:"店铺地址", width:200, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"submittime", label:"提交时间", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"applystatetypeid", label:"申请状态ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"applystatetype", label:"申请状态", width:100, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"checktime", label:"审批时间", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"checkuserid", label:"审批用户ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"checkuser", label:"审批用户", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"ID", editable:false,dispunitType:"text", },
    {name:"ispass", label:"是否通过", editable:true,dispunitType:"checkbox", },
    {name:"applybusinessid", label:"申请服务ID", editable:false,dispunitType:"text", },
    {name:"applybusiness", label:"申请服务", editable:true,dispunitType:"text", },
    {name:"realname", label:"姓名", editable:true,dispunitType:"text", },
    {name:"telephone", label:"电话号", editable:true,dispunitType:"text", },
    {name:"storename", label:"店铺名", editable:true,dispunitType:"text", },
    {name:"storeaddress", label:"店铺地址", editable:true,dispunitType:"text", },
    {name:"submittime", label:"提交时间", editable:true,dispunitType:"time", },
    {name:"applystatetypeid", label:"申请状态ID", editable:false,dispunitType:"text", },
    {name:"applystatetype", label:"申请状态", editable:false,dispunitType:"text", },
    {name:"checktime", label:"审批时间", editable:true,dispunitType:"time", },
    {name:"checkuserid", label:"审批用户ID", editable:false,dispunitType:"text", },
    {name:"checkuser", label:"审批用户", editable:true,dispunitType:"text", }
  ]
}
