package rs.ac.uns.ftn.onlybuns.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendActivationEmail(String toEmail, String activationLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Account Activation - OnlyBuns");
        message.setText("Thank you for registering with OnlyBuns! Please activate your account by clicking the link below:\n" + activationLink);
        message.setFrom("slagalicaprogrameri@gmail.com");

        mailSender.send(message);
    }
}
