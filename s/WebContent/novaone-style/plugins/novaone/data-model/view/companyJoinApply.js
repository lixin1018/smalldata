viewModels.companyJoinApply = {
  id:"7451f583-537a-470c-afcc-ac9b0a5eb573",
  name:"companyJoinApply",
  dataName:"companyJoinApply",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"submittime", label:"申请时间", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"applystatetypeid", label:"状态ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"applystatetype", label:"状态", width:60, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"ccompany", label:"公司", width:150, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"clegalperson", label:"法人", width:80, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"clegalpersonno", label:"法人证件", width:150, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"clinkman", label:"联系人", width:80, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"clinkphone", label:"联系电话", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"clinkaddress", label:"联系地址", width:150, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"cmainbusiness", label:"主营业务", width:200, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"cshopnums", label:"店铺数量", width:80, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"decimal"},
    {name:"cshopacreage", label:"店铺面积(㎡)", width:80, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"decimal"},
    {name:"cimage", label:"店铺形象", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"cremark", label:"备注", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"ID", editable:false,dispunitType:"text", },
    {name:"submittime", label:"申请时间", editable:false,dispunitType:"time", },
    {name:"applystatetypeid", label:"状态ID", editable:false,dispunitType:"text", },
    {name:"applystatetype", label:"状态", editable:false,dispunitType:"text", },
    {name:"ccompany", label:"公司", editable:true,dispunitType:"text", },
    {name:"clegalperson", label:"法人", editable:true,dispunitType:"text", },
    {name:"clegalpersonno", label:"法人证件", editable:true,dispunitType:"text", },
    {name:"clinkman", label:"联系人", editable:true,dispunitType:"text", },
    {name:"clinkphone", label:"联系电话", editable:true,dispunitType:"text", },
    {name:"clinkaddress", label:"联系地址", editable:true,dispunitType:"text", },
    {name:"cmainbusiness", label:"主营业务", editable:true,dispunitType:"text", },
    {name:"cshopnums", label:"店铺数量", editable:true,dispunitType:"decimal", },
    {name:"cshopacreage", label:"店铺面积(㎡)", editable:true,dispunitType:"decimal", },
    {name:"cimage", label:"店铺形象", editable:true,dispunitType:"text", },
    {name:"cremark", label:"备注", editable:true,dispunitType:"text", }
  ]
}
