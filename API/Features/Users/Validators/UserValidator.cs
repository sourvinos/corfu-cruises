using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Users {

    public class UserValidator : AbstractValidator<UserUpdateDto> {

        public UserValidator() {
            RuleFor(x => x.UserName).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Email).Must(EmailHelpers.BeEmptyOrValidEmailAddress).MaximumLength(128);
        }

    }

}