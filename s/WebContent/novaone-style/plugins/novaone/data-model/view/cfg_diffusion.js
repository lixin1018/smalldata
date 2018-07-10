viewModels.cfg_diffusion = {
  id:"84346ca5-cbb5-4628-9103-c7a08cc2679b",
  name:"cfg_diffusion",
  dataName:"cfg_diffusion",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"活动内容 ", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"url", label:"链接地址 ", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"标题名称 ", width:270, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"imgurl", label:"图片路径", width:270, hidden:true, sortable:true, search:true, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"text"},
    {name:"sortindex", label:"自定义排序 ", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"decimal"},
    {name:"placename", label:"广告类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"list"},
    {name:"create_time", label:"创建时间 ", width:80, hidden:true, sortable:true, search:true, resizable:true, editable:true, canEdit:false, edittype:"text", formatter:dateFormater, dispunitType:"date"},
    {name:"publish_place", label:"广告类型值 ", width:0, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:false, edittype:"text", dispunitType:"text"},
    {name:"display_type", label:"是否显示", width:60, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:true, edittype:"text", dispunitType:"list"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,dispunitType:"text", },
    {name:"description", label:"活动内容 ", editable:false,dispunitType:"text", },
    {name:"url", label:"链接地址 ", editable:false,dispunitType:"text", },
    {name:"name", label:"标题名称 ", editable:true,dispunitType:"text", },
    {name:"imgurl", label:"图片路径", editable:true,dispunitType:"text", },
    {name:"sortindex", label:"自定义排序 ", editable:true,dispunitType:"decimal", },
    {name:"placename", label:"广告类型", editable:true,dispunitType:"list", },
    {name:"create_time", label:"创建时间 ", editable:false,dispunitType:"date", },
    {name:"publish_place", label:"广告类型值 ", editable:false,dispunitType:"text", },
    {name:"display_type", label:"是否显示", editable:true,dispunitType:"list", }
  ]
}
