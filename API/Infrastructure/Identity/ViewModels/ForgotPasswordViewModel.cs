using System.ComponentModel.DataAnnotations;

namespace API.Infrastructure.Identity {

    public class ForgotPasswordViewModel {

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Language is required")]
        public string Language { get; set; }

        [Required(ErrorMessage = "Return url is required")]
        public string ReturnUrl { get; set; }

    }

}