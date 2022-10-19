namespace API.Infrastructure.Identity {

    public interface IEmailSender {

        SendEmailResponse SendLoginCredentials(LoginCredentialsViewModel model, string loginLink);

        SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl, string language);

    }

}