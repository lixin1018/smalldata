viewModels.d_RoleMenu = {
  id:"108",
  name:"d_RoleMenu",
  dataName:"d_RoleMenu",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"menuname", label:"菜单项名称", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"roleid", label:"角色id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"rolecode", label:"角色编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"rolename", label:"角色名", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"menuid", label:"菜单项id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"menucode", label:"菜单项编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isenable", label:"可用", width:50, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"menuname", label:"菜单项名称", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"roleid", label:"角色id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"rolecode", label:"角色编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"rolename", label:"角色名", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"menuid", label:"菜单项id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"menucode", label:"菜单项编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isenable", label:"可用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", }
  ]
}
