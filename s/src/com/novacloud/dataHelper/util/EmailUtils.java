package com.novacloud.dataHelper.util;
 
import java.util.Properties;
import java.util.UUID; 
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
 
public class EmailUtils {
   private final static Log logger = LogFactory.getLog( EmailUtils.class ) ;

   //smtp服务器
   private String host; 
   
   public String getHost() {
	   return host;
   }
	
   public void setHost(String host) {
	   this.host = host;
   }

	//发件人地址 
   private String from; 
   public String getFrom() {
	   return from;
   }

   public void setFrom(String from) {
	   this.from = from;
   }

   //用户名
   private String user;
   public String getUser() {
	   return user;
   }

   public void setUser(String user) {
	   this.user = user;	
   }

   //密码
   private String pwd; 
   public String getPwd() {
	   return pwd;
   }

   public void setPwd(String pwd) {
	   this.pwd = pwd;
   }    
 
   public void send(String subject, String content, String to) throws Exception { 
       Properties props = new Properties();

       // 设置发送邮件的邮件服务器的属性（这里使用网易的smtp服务器）
       props.put("mail.smtp.host", host);
       // 需要经过授权，也就是有户名和密码的校验，这样才能通过验证（一定要有这一条）
       props.put("mail.smtp.auth", "true");

       // 用刚刚设置好的props对象构建一个session
       Session session = Session.getDefaultInstance(props);

       // 有了这句便可以在发送邮件的过程中在console处显示过程信息，供调试使
       // 用（你可以在控制台（console)上看到发送邮件的过程）
       session.setDebug(true);

       // 用session为参数定义消息对象
       MimeMessage message = new MimeMessage(session);
 
       String sendTaskId = UUID.randomUUID().toString();
       
       try {
           // 加载发件人地址
           message.setFrom(new InternetAddress(from));
           
           // 加载收件人地址
           message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
           
           // 加载标题
           message.setSubject(subject);

           // 向multipart对象中添加邮件的各个部分内容，包括文本内容和附件
           Multipart multipart = new MimeMultipart();

           // 设置邮件的文本内容
           BodyPart contentPart = new MimeBodyPart();
           contentPart.setText(content);
           multipart.addBodyPart(contentPart); 

           // 将multipart对象放到message中
           message.setContent(multipart);
           
           // 保存邮件
           message.saveChanges();
           
           // 发送邮件
           Transport transport = session.getTransport("smtp");
           
           // 连接服务器的邮箱
           transport.connect(host, user, pwd);
           
           // 把邮件发送出去
           logger.info("Begin send email to " + to +". Send task id = " + sendTaskId + ". Content = " +content);
           transport.sendMessage(message, message.getAllRecipients());
           logger.info("End send email to " + to +". Send task id = " + sendTaskId + ".");
           transport.close();
       } catch (Exception e) {
           logger.info("Error send email to " + to +". Send task id = " + sendTaskId + ".");
           e.printStackTrace();
           throw e;
       }
   } 
}
