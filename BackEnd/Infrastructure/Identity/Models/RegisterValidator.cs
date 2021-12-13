using FluentValidation;

namespace BlueWaterCruises.Infrastructure.Identity {

    public class RegisterValidator : AbstractValidator<RegisterViewModel> {

        public RegisterValidator() {
            RuleFor(x => x.Username).NotNull().NotEmpty().MaximumLength(32);
            RuleFor(x => x.Displayname).NotNull().NotEmpty().MaximumLength(32);
            RuleFor(x => x.CustomerId).NotEmpty();
            RuleFor(x => x.Email).NotNull().NotEmpty().EmailAddress().MaximumLength(128);
            RuleFor(x => x.Password).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.ConfirmPassword).NotNull().NotEmpty().MaximumLength(128).Equal(x => x.Password);
            RuleFor(x => x.IsAdmin).NotNull();
            RuleFor(x => x.IsActive).NotNull();
        }

    }

}