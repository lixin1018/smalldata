viewModels.fl_ReceiveFile = {
  id:"765ad03d-75f6-4be8-8d37-57f069c1050f",
  name:"fl_ReceiveFile",
  dataName:"fl_ReceiveFile",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"用户id", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"hasread", label:"已读", width:50, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"sendfileid", label:"发送记录id", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"readtime", label:"阅读时间", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"receivetime", label:"接收时间", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"hasbringback", label:"已取回", width:50, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"fileids", label:"文件id", width:300, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"userid", label:"用户id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"hasread", label:"已读", editable:false,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"sendfileid", label:"发送记录id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"readtime", label:"阅读时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"receivetime", label:"接收时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"hasbringback", label:"已取回", editable:false,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"fileids", label:"文件id", editable:false,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
