package com.novacloud.novaone.control;

import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

import com.opensymphony.xwork2.ActionSupport;

/**
 * 测试用action
 *
 * @author 于采兴
 * @date 2015-2-14 10:10:04
 * @version Revision: 1.0
 */
@Action
@Results({
		@Result(name = "left", location = "test/left.jsp"),
		@Result(name = "test", location = "test/test.jsp"),
		@Result(name = "loginpage", location = "/page/sys/login.jsp"),
		@Result(name = "ajaxreturnjson", type = "json", params = { "root", "message" }),
		@Result(name = "testReportPage", location = "test/1.1.1.a.jsp")
})
public class TestController extends ActionSupport {

	private static final long serialVersionUID = 1L;

	private String reportNum;
	private String reportFileName;
	/**字段名称唯一性验证返回**/
	private Map<String, String> message;

	public String loginpage(){
		return "loginpage";
	}
	public String testpage(){
		System.out.println("======================");
		return "test";
	}
	public String testReturn(){
		message = new HashMap<String, String>();
		message.put("info", "导入失败！");
		message.put("status", "N");

		return "ajaxreturnjson";
	}



	public String getReport(){

		//reportFileName = ReportContext.getReportMap().get(reportNum);

//		if("hs01".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表一产量.raq";
//		}else if("hs02".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表二商品量.raq";
//		}else if("hs03".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表三工作量表.raq";
//		}else if("hs04".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表四井下作业.raq";
//		}else if("hs05".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表五化工料.raq";
//		}else if("hs06".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表六成本（基础表）.raq";
//		}else if("hs07".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表七成本（汇总表）.raq";
//		}else if("hs08".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表八利润.raq";
//		}else if("hs09".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表九十大指标.raq";
//		}else if("hs10".equals(reportNum)){
//			reportFileName = "（预算、核算）上交 - 分区块_表十经济技术指标.raq";
//		}
		return "testReportPage";
	}

	public String getReportNum() {
		return reportNum;
	}

	public void setReportNum(String reportNum) {
		this.reportNum = reportNum;
	}

	public String getReportFileName() {
		return reportFileName;
	}

	public void setReportFileName(String reportFileName) {
		this.reportFileName = reportFileName;
	}
	public Map<String, String> getMessage() {
		return message;
	}
	public void setMessage(Map<String, String> message) {
		this.message = message;
	}


}
