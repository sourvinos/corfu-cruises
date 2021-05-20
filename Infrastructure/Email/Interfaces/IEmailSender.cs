namespace CorfuCruises {

    public interface IEmailSender {

        SendEmailResponse SendFirstLoginCredentials(FirstLoginCredentialsViewModel model, string loginLink);

        SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl, string language);

        void EmailVoucher(Voucher voucher);

    }

}