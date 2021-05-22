using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using MimeKit;

namespace CorfuCruises {

    public class AppCorfuCruisesEmail : IEmailSender {

        private readonly IWebHostEnvironment env;
        private readonly AppCorfuCruisesSettings settings;

        public AppCorfuCruisesEmail(IWebHostEnvironment env, IOptions<AppCorfuCruisesSettings> settings) {
            this.env = env;
            this.settings = settings.Value;
        }

        public SendEmailResponse SendLoginCredentials(LoginCredentialsViewModel model, string loginLink) {

            var message = new MimeMessage();

            var htmlContent = "";
            var body = EmailMessages.FirstLoginCredentials(model.Language);

            htmlContent += "<h1 style = 'font-weight: 500;'><span style = 'color: #0078d7;'>Corfu</span><span style = 'color: #5db2ff;'> Cruises</span></h1>";
            htmlContent += "<p>" + body[0] + model.DisplayName + "!" + "</p>";
            htmlContent += "<p>" + body[1] + "</p>";
            htmlContent += "<p>" + body[2] + model.UserName + "</p>";
            htmlContent += "<p>" + body[3] + model.Password + "</p>";
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
            var builder = new BodyBuilder();

            builder.HtmlBody = this.UpdateResetPasswordWithVariables(displayName, callbackUrl);

            message.Body = builder.ToMessageBody();
            message.From.Add(new MailboxAddress(settings.From, settings.Username));
            message.To.Add(new MailboxAddress(displayName, userEmail));
            message.Subject = "Your request for new password";

            using (var client = new MailKit.Net.Smtp.SmtpClient()) {
                client.Connect(settings.SmtpClient, settings.Port, false);
                client.Authenticate(settings.Username, settings.Password);
                client.Send(message);
                client.Disconnect(true);
            }

            return new SendEmailResponse();

        }

        public void EmailVoucher(Voucher voucher) {
            this.CreateVoucher(voucher);
            this.SendVoucherToEmail(voucher);
        }

        private string UpdateResetPasswordWithVariables(string displayName, string callbackUrl) {

            var response = ResetPasswordTemplate.GetHtmlString(displayName, callbackUrl);

            var updatedResponse = response
                .Replace("[displayName]", displayName)
                .Replace("[callbackUrl]", callbackUrl);
            return updatedResponse;

        }

        private void CreateVoucher(Voucher voucher) { }

        private SendEmailResponse SendVoucherToEmail(Voucher voucher) {

            var attachment = new MimePart("image", "gif") {
                Content = new MimeContent(File.OpenRead("Output\\Voucher.pdf"), ContentEncoding.Default),
                ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                ContentTransferEncoding = ContentEncoding.Base64,
                FileName = Path.GetFileName("Output\\Voucher.pdf")
            };

            var message = new MimeMessage();

            message.From.Add(new MailboxAddress("", "postmaster@appcorfucruises.com"));
            message.To.Add(new MailboxAddress(voucher.Email, voucher.Email));
            message.Subject = "Your Reservation With Corfu Cruises Is Ready!";

            var multipart = new Multipart("mixed");
            multipart.Add(attachment);
            message.Body = multipart;

            using (var client = new MailKit.Net.Smtp.SmtpClient()) {
                client.Connect(settings.SmtpClient, settings.Port, false);
                client.Authenticate(settings.Username, settings.Password);
                client.Send(message);
                client.Disconnect(true);
            }

            foreach (var part in message.BodyParts.OfType<MimePart>())
                part.Content?.Stream.Dispose();

            return new SendEmailResponse();

        }

    }

}