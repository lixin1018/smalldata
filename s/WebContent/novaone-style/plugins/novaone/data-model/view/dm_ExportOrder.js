viewModels.dm_ExportOrder = {
  id:"d06a06ee-7861-4c7e-bb56-50bf4a8ad9ff",
  name:"dm_ExportOrder",
  dataName:"dm_ExportOrder",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"createtime", label:"创建时间", width:140, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"createuserid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createusername", label:"创建人", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"originaltotalprice", label:"原价", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"actualtotalprice", label:"实际价格", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"payprice", label:"支付价格", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"paytime", label:"支付时间", width:140, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"status", label:"状态", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"ordernumber", label:"订单号", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"subjectinfo", label:"主题", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"bodyinfo", label:"详情", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"createtime", label:"创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"createuserid", label:"创建人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"createusername", label:"创建人", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"originaltotalprice", label:"原价", editable:false,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"actualtotalprice", label:"实际价格", editable:false,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"payprice", label:"支付价格", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"paytime", label:"支付时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"status", label:"状态", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"ordernumber", label:"订单号", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"subjectinfo", label:"主题", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"bodyinfo", label:"详情", editable:false,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
