package rs.ac.uns.ftn.onlybuns.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    public void sendActivationEmail(String toEmail, String activationLink) {
        Email from = new Email("slagalicaprogrameri@gmail.com"); // Verified email on SendGrid
        Email to = new Email(toEmail);
        String subject = "Account Activation - OnlyBuns";
        Content content = new Content("text/plain", "Thank you for registering with OnlyBuns! Please activate your account by clicking the link below:\n" + activationLink);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            if (response.getStatusCode() == 202) {
                logger.info("Activation email sent successfully to {}", toEmail);
            } else {
                logger.error("Failed to send activation email. Status Code: {}", response.getStatusCode());
                logger.error("Response Body: {}", response.getBody());
            }
        } catch (IOException e) {
            logger.error("Error sending activation email: {}", e.getMessage());
        }
    }

    public void sendWeeklyUpdate(String toEmail, int newFollowers, int newLikes, int newComments, int newPosts) {
        Email from = new Email("slagalicaprogrameri@gmail.com"); // Verified email on SendGrid
        Email to = new Email(toEmail);
        String subject = "Your Weekly Activity Summary - OnlyBuns";
        Content content = new Content("text/plain",
                  "Hello,\n\n" +
                        "We noticed you haven't accessed OnlyBuns in the last 7 days. Here's what you've missed:\n\n" +
                        "- New followers: " + newFollowers + "\n" +
                        "- New likes on your posts: " + newLikes + "\n" +
                        "- New comments on your posts: " + newComments + "\n" +
                        "- New posts from people you follow: " + newPosts + "\n\n" +
                        "Stay connected and check out the latest activity on OnlyBuns!\n" +
                        "Click here to log in: [Login Link]\n\n" +
                        "Best regards,\n" +
                        "The OnlyBuns Team");

        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            if (response.getStatusCode() == 202) {
                logger.info("Weekly update sent successfully to {}", toEmail);
            } else {
                logger.error("Failed to send weekly update email. Status Code: {}", response.getStatusCode());
                logger.error("Response Body: {}", response.getBody());
            }
        } catch (IOException e) {
            logger.error("Error sending weekly update email: {}", e.getMessage());
        }
    }
}
