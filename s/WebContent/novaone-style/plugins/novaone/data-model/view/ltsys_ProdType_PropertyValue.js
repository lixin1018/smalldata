viewModels.ltsys_ProdType_PropertyValue = {
  id:"0f593425-48c8-4ed3-a499-9c42b4bbe6f3",
  name:"ltsys_ProdType_PropertyValue",
  dataName:"ltsys_ProdType_PropertyValue",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"property_value", label:"属性值", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"sortindex", label:"排序", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"decimal"},
    {name:"effect_pricevalue", label:"价格影响值", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"decimal"},
    {name:"description", label:"描述", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"create_time", label:"创建时间", width:140, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"create_user_id", label:"创建人Id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"create_user_name", label:"创建人", width:70, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"ltsys_prodtype_property_id", label:"属性类型Id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"modify_time", label:"修改时间", width:140, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modify_user_id", label:"修改人Id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"modify_user_name", label:"修改人", width:70, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"property_value", label:"属性值", editable:true,dispunitType:"text", },
    {name:"sortindex", label:"排序", editable:true,dispunitType:"decimal", },
    {name:"effect_pricevalue", label:"价格影响值", editable:true,dispunitType:"decimal", },
    {name:"description", label:"描述", editable:true,dispunitType:"text", },
    {name:"create_time", label:"创建时间", editable:false,dispunitType:"time", },
    {name:"create_user_id", label:"创建人Id", editable:false,dispunitType:"text", },
    {name:"create_user_name", label:"创建人", editable:false,dispunitType:"text", },
    {name:"id", label:"id", editable:false,dispunitType:"text", },
    {name:"ltsys_prodtype_property_id", label:"属性类型Id", editable:false,dispunitType:"text", },
    {name:"modify_time", label:"修改时间", editable:false,dispunitType:"time", },
    {name:"modify_user_id", label:"修改人Id", editable:false,dispunitType:"text", },
    {name:"modify_user_name", label:"修改人", editable:false,dispunitType:"text", }
  ]
}
