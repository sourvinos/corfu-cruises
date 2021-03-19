using FluentValidation;

namespace CorfuCruises {

    public class GenderValidator : AbstractValidator<Gender> {

        public GenderValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}