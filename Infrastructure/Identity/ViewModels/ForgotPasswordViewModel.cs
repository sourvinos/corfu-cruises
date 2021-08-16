using System.ComponentModel.DataAnnotations;

namespace BlueWaterCruises {

    public class ForgotPasswordViewModel {

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Language is required")]
        public string Language { get; set; }

    }

}