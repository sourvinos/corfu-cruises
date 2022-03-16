using FluentValidation;

namespace API.Infrastructure.Identity {

    public class RegisterValidator : AbstractValidator<RegisterViewModel> {

        public RegisterValidator() {
            RuleFor(x => x.UserName).NotNull().NotEmpty().MaximumLength(32);
            RuleFor(x => x.Displayname).NotNull().NotEmpty().MaximumLength(32);
            RuleFor(x => x.Email).NotNull().NotEmpty().EmailAddress().MaximumLength(128);
            RuleFor(x => x.Password).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.ConfirmPassword).NotNull().NotEmpty().MaximumLength(128).Equal(x => x.Password);
            RuleFor(x => x.IsAdmin).NotNull();
        }

    }

}