package com.novacloud.novaone.excelGrid.definition;

import java.util.HashMap;

public class ExcelGridFontNames {
	private static String[][] fontArray =new String[][] {
		{ "宋体", "SimSun"},
		{ "黑体", "SimHei"},
		{ "楷体", "KaiTi"},
		{ "新宋体", "	NSimSun"},
		{ "仿宋", "FangSong"},
		{ "微软雅黑", "Microsoft YaHei"},
		{ "微软正黑体", "Microsoft JhengHei"},
		{ "标楷体", "BiauKai"},
		{ "新细明体", "PMingLiU"},
		{ "细明体", "	MingLiU"},
		{ "标楷体", "	DFKai-SB"},
		{ "华文细黑", "STXihei"},
		{ "华文黑体", "STHeiti"},
		{ "华文楷体", "STKaiti"},
		{ "华文宋体", "STSong"},
		{ "华文中宋", "STZhongsong"},
		{ "华文仿宋", "STFangsong"},
		{ "华文彩云", "STCaiyun"},
		{ "华文琥珀", "STHupo"},
		{ "华文隶书", "STLiti"},
		{ "文行楷	", "STXingkai"},
		{ "华文新魏", "STXinwei"},
		{ "丽黑 Pro", "LiHei Pro Medium"},
		{ "丽宋 Pro", "LiSong Pro Light"},
		{ "苹果丽中黑", "Apple LiGothic Medium"},
		{ "苹果丽细宋", "Apple LiSung Light"},
		{ "隶书", "LiSu"},
		{ "幼圆", "YouYuan"},
		{ "方正舒体", "FZShuTi"},
		{ "方正姚体", "FZYaoti"},
		{ "Arial", "Arial"},
		{ "Book Antiqua", "Book Antiqua"},
		{ "Century Gothic", "Century Gothic"},
		{ "Courier New", "Courier New"},
		{ "Georgia", "Georgia"},
		{ "Impact", "Impact"},
		{ "PmingLiu", "PmingLiu"},
		{ "Tahoma", "Tahoma"},
		{ "Times New Roman", "Times New Roman"},
		{ "Verdana", "Verdana"}};
		
		private static HashMap<String, String> nameToIds = null;
		private static HashMap<String, String> getNameToIds(){
			if(ExcelGridFontNames.nameToIds == null){
				HashMap<String, String> nameToIds = new HashMap<String, String>();
				for(int i = 0; i < fontArray.length; i++){
					String[] font = fontArray[i];
					nameToIds.put(font[0], font[1]);
				}
				ExcelGridFontNames.nameToIds = nameToIds;
			}
			return ExcelGridFontNames.nameToIds;
		}
		public static String getFontId(String fontName){
			HashMap<String, String> nameToIds = ExcelGridFontNames.getNameToIds();
			if(nameToIds.containsKey(fontName)){
				return nameToIds.get(fontName);
			}
			else{
				return "SimSun";
			}
		}

		private static HashMap<String, String> idToNames = null;
		private static HashMap<String, String> getIdToNames(){
			if(ExcelGridFontNames.idToNames == null){
				HashMap<String, String> idToNames = new HashMap<String, String>();
				for(int i = 0; i < fontArray.length; i++){
					String[] font = fontArray[i];
					idToNames.put(font[1], font[0]);
				}
				ExcelGridFontNames.idToNames = idToNames;
			}
			return ExcelGridFontNames.idToNames;
		}
		public static String getFontName(String fontId){
			HashMap<String, String> idToNames = ExcelGridFontNames.getIdToNames();
			if(idToNames.containsKey(fontId)){
				return idToNames.get(fontId);
			}
			else{
				return "宋体";
			}
		}
}
