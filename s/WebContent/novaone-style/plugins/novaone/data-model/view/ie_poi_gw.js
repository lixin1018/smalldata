viewModels.ie_poi_gw = {
  id:"10bcd4ed-686b-4f5b-ba38-3700c4cd3ee9",
  name:"ie_poi_gw",
  dataName:"ie_poi_gw",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"uid", label:"uid", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"title", label:"title", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"province", label:"province", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"city", label:"city", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"address", label:"address", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"phonenumber", label:"phoneNumber", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"postcode", label:"postcode", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"url", label:"url", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"lat", label:"lat", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"lng", label:"lng", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"记录创建时间", width:0, hidden:true, sortable:true, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"isdeleted", label:"已删除", width:50, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"uid", label:"uid", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"title", label:"title", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"province", label:"province", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"city", label:"city", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"address", label:"address", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"phonenumber", label:"phoneNumber", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"postcode", label:"postcode", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"url", label:"url", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"lat", label:"lat", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"lng", label:"lng", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"id", label:"ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"记录创建时间", editable:true,nullable:true, hidden:true, dispunitType:"time", },
    {name:"isdeleted", label:"已删除", editable:true,nullable:true, hidden:true, dispunitType:"checkbox", }
  ]
}
