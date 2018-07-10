viewModels.fl_SendFile = {
  id:"f52f36c5-2ac9-412a-acc5-3ba94854496c",
  name:"fl_SendFile",
  dataName:"fl_SendFile",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"fileids", label:"文件id", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"fromuserid", label:"发送人id", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"touserids", label:"接收人id", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sendtime", label:"发送时间", width:100, hidden:false, sortable:true, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"message", label:"消息", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isdeleted", label:"已删除", width:50, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"deletetime", label:"删除时间", width:100, hidden:false, sortable:true, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"tousernames", label:"接收人", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"touseremails", label:"接收人邮箱", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"hasbringback", label:"已取回", width:50, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"bringbacktime", label:"取回时间", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"filenames", label:"文件名", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"fileids", label:"文件id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"fromuserid", label:"发送人id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"touserids", label:"接收人id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"sendtime", label:"发送时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"message", label:"消息", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isdeleted", label:"已删除", editable:false,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"deletetime", label:"删除时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"tousernames", label:"接收人", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"touseremails", label:"接收人邮箱", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"hasbringback", label:"已取回", editable:false,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"bringbacktime", label:"取回时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"filenames", label:"文件名", editable:false,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
