using FluentValidation;

namespace CorfuCruises {

    public class NationalityValidator : AbstractValidator<Nationality> {

        public NationalityValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Code).NotNull().NotEmpty().MaximumLength(2);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}