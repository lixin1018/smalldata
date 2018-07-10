viewModels.dmdt_bi_strainspaper_line = {
  id:"9dad6387-a3ba-47a3-89ed-5c822c7e4b3b",
  name:"dmdt_bi_strainspaper_line",
  dataName:"dmdt_bi_strainspaper_line",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"code", label:"编码", width:60, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:120, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"publishyear", label:"发表年份", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"weburl", label:"论文网址", width:60, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"abstracturl", label:"摘要网址", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"filepath", label:"文件路径", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"filetype", label:"文件类型", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"txtfilepath", label:"文本路径", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"errorinfo", label:"错误信息", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"positivesentancecount", label:"阳性句数", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"negativesentancecount", label:"阴性句数", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"bothsentancecount", label:"双性句数", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"decimal"}
  ],
  dispUnitModel:[
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"publishyear", label:"发表年份", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"weburl", label:"论文网址", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"abstracturl", label:"摘要网址", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"filepath", label:"文件路径", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"filetype", label:"文件类型", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"txtfilepath", label:"文本路径", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"errorinfo", label:"错误信息", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"positivesentancecount", label:"阳性句数", editable:false,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"negativesentancecount", label:"阴性句数", editable:false,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"bothsentancecount", label:"双性句数", editable:false,nullable:true, hidden:false, dispunitType:"decimal", }
  ]
}
