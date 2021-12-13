using BlueWaterCruises.Features.Vouchers;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Infrastructure.Email {

    public interface IEmailSender {

        SendEmailResponse SendLoginCredentials(LoginCredentialsViewModel model, string loginLink);

        SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl, string language);

        Response SendVoucher(VoucherEmail voucher);

    }

}