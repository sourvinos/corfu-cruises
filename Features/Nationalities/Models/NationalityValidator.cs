using FluentValidation;

namespace ShipCruises {

    public class NationalityValidator : AbstractValidator<Nationality> {

        public NationalityValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Code).NotNull().NotEmpty().MaximumLength(6);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}