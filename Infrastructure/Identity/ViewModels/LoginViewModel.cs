using System.ComponentModel.DataAnnotations;

namespace ShipCruises {

    public class LoginViewModel {

        [Required]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

    }

}