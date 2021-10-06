using System.ComponentModel.DataAnnotations;

namespace BlueWaterCruises {

    public class LoginViewModel {

        [Required]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

    }

}