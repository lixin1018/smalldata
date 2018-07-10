viewModels.fl_UserFile = {
  id:"9327ba2c-00b9-4f22-b33e-f8d37b6acc2d",
  name:"fl_UserFile",
  dataName:"fl_UserFile",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isdir", label:"是否为文件夹", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"filetype", label:"类型", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"filesize", label:"大小", width:80, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"lastmodifytime", label:"最后修改时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"createuserid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modifyuserid", label:"修改人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"所属文件夹id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isdeleted", label:"已删除", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"relativepath", label:"存储相对路径", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isdir", label:"是否为文件夹", editable:false,nullable:false, hidden:true, dispunitType:"checkbox", },
    {name:"filetype", label:"类型", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"filesize", label:"大小", editable:false,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"createtime", label:"创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"lastmodifytime", label:"最后修改时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"createuserid", label:"创建人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"modifyuserid", label:"修改人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"description", label:"描述", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"parentid", label:"所属文件夹id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"isdeleted", label:"已删除", editable:false,nullable:false, hidden:true, dispunitType:"checkbox", },
    {name:"relativepath", label:"存储相对路径", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
