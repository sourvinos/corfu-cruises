namespace CorfuCruises {

    public interface IEmailSender {

        SendEmailResponse SendLoginCredentials(LoginCredentialsViewModel model, string loginLink);

        SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl, string language);

        SendEmailResponse EmailVoucher(string email);

    }

}