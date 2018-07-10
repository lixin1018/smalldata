viewModels.eg_Definition = {
  id:"e8a59be3-6f78-4be7-b795-8eaa1474aaaa",
  name:"eg_Definition",
  dataName:"eg_Definition",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:400, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"teamid", label:"团队id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"teamname", label:"团队", width:200, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"createtime", label:"创建时间", width:120, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:120, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"description", label:"描述", width:139, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createusername", label:"创建人", width:100, hidden:true, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createuserid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"modifyusername", label:"修改人", width:100, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"modifyuserid", label:"修改人id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"teamid", label:"团队id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"teamname", label:"团队", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:true, dispunitType:"time", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createusername", label:"创建人", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createuserid", label:"创建人id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"modifyusername", label:"修改人", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"modifyuserid", label:"修改人id", editable:false,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
