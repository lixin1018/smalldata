viewModels.wf_DriveInstanceList = {
  id:"b1a16c0c-b914-4855-9102-65f5a8f5f00e",
  name:"wf_DriveInstanceList",
  dataName:"wf_DriveInstanceList",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"doctypename", label:"单据类型", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"abstractnote", label:"摘要信息", width:400, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"currentstatus", label:"当前状态", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"username", label:"创建人", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"orgname", label:"组织名称", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"currentnodes", label:"当前所在节点Id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isbegin", label:"尚未提交", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"orgid", label:"组织id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"docdataid", label:"单据id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"doctypeid", label:"单据类型id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"instusercreatetime", label:"接收时间", width:120, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"instuserid", label:"处理人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"doctypename", label:"单据类型", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"abstractnote", label:"摘要信息", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"currentstatus", label:"当前状态", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"username", label:"创建人", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"orgname", label:"组织名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"currentnodes", label:"当前所在节点Id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"isbegin", label:"尚未提交", editable:false,nullable:false, hidden:true, dispunitType:"checkbox", },
    {name:"orgid", label:"组织id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"userid", label:"创建人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"docdataid", label:"单据id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"doctypeid", label:"单据类型id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"instusercreatetime", label:"接收时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"instuserid", label:"处理人id", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
