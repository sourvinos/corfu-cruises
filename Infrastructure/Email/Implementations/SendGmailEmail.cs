using System;
using Microsoft.Extensions.Options;
using MimeKit;

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

        public SendEmailResponse SendVoucher(Voucher model) {

            var message = new MimeMessage();
            var passengers = "";
            var pickupPointCoords = "https://www.google.gr/maps/place/Przystanek+autobusowy/@39.6510638,19.8423309,17z/data=!4m5!3m4!1s0x135b5b8d7c6f20b7:0x7852eadb7d4f8c91!8m2!3d39.6514545!4d19.8428187";
            var portCoords = "https://www.google.gr/maps/place/39%C2%B037'41.8%22N+19%C2%B054'14.3%22E/@39.6282691,19.9017833,890m/data=!3m2!1e3!4b1!4m6!3m5!1s0x0:0x0!7e2!8m2!3d39.6282649!4d19.9039718";

            message.From.Add(new MailboxAddress("", "bestofMappings@gmail.com"));
            message.To.Add(new MailboxAddress("You", model.Email));

            foreach (var passenger in model.Passengers) {
                passengers += passenger.Lastname + " " + passenger.Firstname + " " + passenger.DoB.ToString("d MMMM yyyy") + "<br />";
            }

            message.Subject = "Your Reservation With Corfu Cruises Is Ready!";

            message.Body = new TextPart("Html") {
                Text =
                    "Date: " + model.Date.ToString("dddd, d MMMM yyyy") + "<br />" +
                    "Destination: " + model.DestinationDescription + "<br />" +
                    "Pickup point" + "<br />" +
                        "Description: " + model.PickupPointDescription + "<br />" +
                        "Exact point: " + model.PickupPointExactPoint + "<br />" +
                        "Time: " + model.PickupPointTime + "<br />" +
                    "<a href=" + pickupPointCoords + ">" + "Show pickup point on the map" + "</a>" + "<br />" +
                    "Phones: " + model.Phones + "<br />" +
                    "Special care: " + model.SpecialCare + "<br />" +
                    "Remarks: " + model.Remarks + "<br />" +
                    "<br />" +
                    "Passengers " + "<br />" + passengers +
                    "<div style='align-items: center; display: flex; height: 200px; justify-content: center; margin-bottom: 1rem; margin-top: 1rem; width: 200px;'>" +
                        "<img src=" + model.URI + " />" + "<br />" +
                    "</div>" +
                     "In case you are going to the port on your own, click" + "<a href=" + portCoords + ">" + " here " + "</a>" + "to see the port on the map"
            };

            using (var client = new MailKit.Net.Smtp.SmtpClient()) {
                client.Connect(settings.SmtpClient, settings.Port, false);
                client.Authenticate(settings.Username, settings.Password);
                client.Send(message);
                client.Disconnect(true);
            }

            return new SendEmailResponse();
        }

    }

}