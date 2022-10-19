using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Users {

    public class UserValidator : AbstractValidator<UserNewDto> {

        public UserValidator() {
            RuleFor(x => x.UserName).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Displayname).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Email).Must(EmailHelpers.BeValidEmailAddress).MaximumLength(128);
            RuleFor(x => x.Password).Equal(x => x.ConfirmPassword);
        }

    }

}