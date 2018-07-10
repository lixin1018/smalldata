viewModels.dmdt_bi_strainspaper_sentance = {
  id:"80dcf726-1c0e-42f7-8360-99f023f44b46",
  name:"dmdt_bi_strainspaper_sentance",
  dataName:"dmdt_bi_strainspaper_sentance",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"content", label:"内容", width:600, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isnegative", label:"阴性", width:60, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"ispositive", label:"阳性", width:60, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"decimal", },
    {name:"content", label:"内容", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isnegative", label:"阴性", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"ispositive", label:"阳性", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
