<style>
	.selectFileDiv{
		width:480;
		height:40px;
		margin:0 auto;
		margin-top:20px;
		position:relative;
		text-align:left;
	}
	.uploadSelectFileInputBtn{
		position:absolute;
		top:5px;
		left:110px;
		cursor:pointer;
		margin:10px;
		text-align:center;
	}
	.selectPromptDiv{
		position:absolute;
		top:0px;
		left:105px;
		width:100%;
		height:23px;
		line-height:23px;
		font-size:10px;
	}
	.selectErrorDiv{
		width:100%;
		height:100p;
		font-size:10px;
		color: #FF4300;
		display:none;
	}
	.uploadFileBtnDiv{
		width:100%;
		margin-top:10px; 
		height:40px;
		line-height:40px;	
		cursor: pointer;
		text-align:center; 
		color:#ffffff;
		background-color:#F56600; 
	}
    .uploadify-button {
        background-color: transparent;
        border: none;
        padding: 0;
    }
    .uploadify:hover .uploadify-button {
        background-color: transparent;
    }
</style>
<div id="uploadWindowDivId" style="display:none;height:300px;width:500px;">  
    <div class="selectFileDiv">
       	<input type="file" name="uploadify" id="selectFileBtnId" />
  		<span class="selectPromptDiv" id="selectFilePromptDivId">请选择要上传的文件(文件大小不能超过2M)</span>
  	</div>		       	
	<div id="fileQueueDivId"></div>
	<div class="selectErrorDiv" id="selectErrorDivId"></div>
	<div class="uploadFileBtnDiv" id="uploadFileBtnDivId">执行上传</div>	 
</div>