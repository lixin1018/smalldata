viewModels.prod_Sub_Base = {
  id:"c7b15ddc-6b3c-46d5-9a70-8cbbf5a3c466",
  name:"prod_Sub_Base",
  dataName:"prod_Sub_Base",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"id", label:"Id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"original_price", label:"原价", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"decimal"},
    {name:"actual_price", label:"现价", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"decimal"},
    {name:"description", label:"描述", width:100, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"property_value_xml", label:"属性值", width:200, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"isonsale", label:"是否在售", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"code", label:"编码", width:300, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"version", label:"版本", width:140, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"sale_num", label:"销售数", width:80, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"decimal"},
    {name:"comment_num", label:"评论数", width:80, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"decimal"},
    {name:"create_time", label:"创建时间", width:140, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modify_time", label:"修改时间", width:140, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"source_subprod_id", label:"源子商品Id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"prod_main_id", label:"商品主表Id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"edit_user_id", label:"编辑人Id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"Id", editable:false,dispunitType:"text", },
    {name:"name", label:"名称", editable:true,dispunitType:"text", },
    {name:"original_price", label:"原价", editable:true,dispunitType:"decimal", },
    {name:"actual_price", label:"现价", editable:true,dispunitType:"decimal", },
    {name:"description", label:"描述", editable:true,dispunitType:"text", },
    {name:"property_value_xml", label:"属性值", editable:true,dispunitType:"text", },
    {name:"isonsale", label:"是否在售", editable:true,dispunitType:"checkbox", },
    {name:"code", label:"编码", editable:false,dispunitType:"text", },
    {name:"version", label:"版本", editable:false,dispunitType:"text", },
    {name:"sale_num", label:"销售数", editable:false,dispunitType:"decimal", },
    {name:"comment_num", label:"评论数", editable:false,dispunitType:"decimal", },
    {name:"create_time", label:"创建时间", editable:false,dispunitType:"time", },
    {name:"modify_time", label:"修改时间", editable:false,dispunitType:"time", },
    {name:"source_subprod_id", label:"源子商品Id", editable:false,dispunitType:"text", },
    {name:"prod_main_id", label:"商品主表Id", editable:false,dispunitType:"text", },
    {name:"edit_user_id", label:"编辑人Id", editable:false,dispunitType:"text", }
  ]
}
