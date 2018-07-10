<%@ page language="java" contentType="image/jped"%>
<%  

	//根据参数codeurl，生成二维码，返回给客户端
	InputStream buffin = new ByteArrayInputStream(/*byte[]数据*/);
	String str= picUrl.getImageType();  
    String imgtype[] = str.split("/"); 
	BufferedImage img;
	try {
		img = ImageIO.read(buffin);
		// 禁止图像缓存。
		this.getResponse().setHeader("Pragma", "no-cache");
		this.getResponse().setHeader("Cache-Control", "no-cache");
		this.getResponse().setDateHeader("Expires", 0);
		this.getResponse().setContentType(picUrl.getImageType());
	
	
		// 将图像输出到Servlet输出流中。
		ServletOutputStream sos;
		sos = this.getResponse().getOutputStream();
		ImageIO.write(img, imgtype[1], sos);
		sos.close();
	} 
	catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} 	
%>