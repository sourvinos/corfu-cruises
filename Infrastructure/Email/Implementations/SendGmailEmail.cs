using System;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Utils;

namespace CorfuCruises {

    public class SendGmailEmail : IEmailSender {

        private readonly GmailSettings settings;

        public SendGmailEmail(IOptions<GmailSettings> settings) {
            this.settings = settings.Value;
        }

        public SendEmailResponse SendFirstLoginCredentials(FirstLoginCredentialsViewModel model, string loginLink) {

            var message = new MimeMessage();

            var htmlContent = "";
            var body = EmailMessages.FirstLoginCredentials(model.Language);

            htmlContent += "<h1 style = 'font-weight: 500;'><span style = 'color: #0078d7;'>Corfu</span><span style = 'color: #5db2ff;'> Cruises</span></h1>";
            htmlContent += "<p>" + body[0] + model.DisplayName + "!" + "</p>";
            htmlContent += "<p>" + body[1] + "</p>";
            htmlContent += "<p>" + body[2] + model.UserName + "</p>";
            htmlContent += "<p>" + body[3] + model.OneTimePassword + "</p>";
            htmlContent += "<br>";
            htmlContent += "<a style = 'font-variant: petite-caps; color: #ffffff; margin: 1rem; background-color: #55828B; padding: 1rem; border-radius: 5px; text-decoration: none;' href=" + loginLink + ">" + body[7] + "</a>";
            htmlContent += "<br>";
            htmlContent += "<br>";
            htmlContent += "<p style = 'color: #ff0000;'>" + body[4] + "</p>";
            htmlContent += "<p style = 'color: #ff0000;'>" + body[5] + "</p>";
            htmlContent += "<p style = 'color: #ff0000;'>" + body[6] + "</p>";
            htmlContent += "<br>";
            htmlContent += "<p>" + body[8] + "</p>";
            htmlContent += "<br>";
            htmlContent += "<p>" + body[9] + "</p>";
            htmlContent += "<p>Corfu Cruises " + DateTime.Now.ToString("yyyy") + "</p>";

            message.From.Add(new MailboxAddress(settings.From, settings.Username));
            message.To.Add(new MailboxAddress(model.DisplayName, model.Email));
            message.Subject = body[10];
            message.Body = new TextPart("html") {
                Text = htmlContent
            };

            using (var client = new MailKit.Net.Smtp.SmtpClient()) {
                client.Connect(settings.SmtpClient, settings.Port, false);
                client.Authenticate(settings.Username, settings.Password);
                client.Send(message);
                client.Disconnect(true);
            }

            return new SendEmailResponse();

        }

        public SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl, string language) {

            var message = new MimeMessage();

            var htmlContent = "";
            var body = EmailMessages.ResetPassword(language);

            htmlContent += "<h1 style = 'font-weight: 500;'><span style = 'color: #0078d7;'>Corfu</span><span style = 'color: #5db2ff;'> Cruises</span></h1>";
            htmlContent += "<p>" + body[0] + displayName + "!" + "</p>";
            htmlContent += "<p>" + body[1] + "</p>";
            htmlContent += "<p>" + body[2] + "</p>";
            htmlContent += "<br>";
            htmlContent += "<a style = 'font-variant: petite-caps; color: #ffffff; margin: 1rem; background-color: #55828B; padding: 1rem; border-radius: 5px; text-decoration: none;' href=" + callbackUrl + ">" + body[3] + "</a>";
            htmlContent += "<br>";
            htmlContent += "<br>";
            htmlContent += "<p style = 'color: #ff0000;'>" + body[4] + "</p>";
            htmlContent += "<p style = 'color: #ff0000;'>" + body[5] + "</p>";
            htmlContent += "<p style = 'color: #ff0000;'>" + body[6] + "</p>";
            htmlContent += "<br>";
            htmlContent += "<p>" + body[7] + "</p>";
            htmlContent += "<br>";
            htmlContent += "<p>" + body[8] + "</p>";
            htmlContent += "<p style = 'font-'>Corfu Cruises " + DateTime.Now.ToString("yyyy") + "</p>";

            message.From.Add(new MailboxAddress(settings.From, settings.Username));
            message.To.Add(new MailboxAddress(displayName, userEmail));
            message.Subject = body[9];
            message.Body = new TextPart("html") {
                Text = htmlContent
            };

            using (var client = new MailKit.Net.Smtp.SmtpClient()) {
                client.Connect(settings.SmtpClient, settings.Port, false);
                client.Authenticate(settings.Username, settings.Password);
                client.Send(message);
                client.Disconnect(true);
            }

            return new SendEmailResponse();

        }

        public SendEmailResponse SendVoucher(Booking model) {

            var mimeMessage = new MimeMessage();
            var bodyBuilder = new MimeKit.BodyBuilder { HtmlBody = "" };
            // var embeddedImage = bodyBuilder.LinkedResources.Add(@"Dump\qrcode.png");

            mimeMessage.From.Add(new MailboxAddress("", "bestofcorfucruises@gmail.com"));
            mimeMessage.To.Add(new MailboxAddress("You", model.Email));
            mimeMessage.Subject = "Reservation";
            bodyBuilder.TextBody = "Date: xx/xx/xxxx Destination: xxx PersonA, PersonB, PersonC";

            // embeddedImage.ContentId = MimeUtils.GenerateMessageId();
            bodyBuilder.HtmlBody = bodyBuilder.TextBody + bodyBuilder.HtmlBody + @"<img src=" + model.ImageUri + " />";
            mimeMessage.Body = bodyBuilder.ToMessageBody();

            using (var client = new MailKit.Net.Smtp.SmtpClient()) {
                client.Connect(settings.SmtpClient, settings.Port, false);
                client.Authenticate(settings.Username, settings.Password);
                client.Send(mimeMessage);
                client.Disconnect(true);
            }

            return new SendEmailResponse();
        }

    }

}