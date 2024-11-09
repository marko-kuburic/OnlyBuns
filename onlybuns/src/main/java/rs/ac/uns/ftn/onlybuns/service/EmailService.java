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
}
