using System.ComponentModel.DataAnnotations;

namespace CorfuCruises {

    public class SendVoucherViewModel {

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        public string Message { get; set; }

    }

}