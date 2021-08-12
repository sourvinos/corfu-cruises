using FluentValidation;

namespace ShipCruises.Features.Ships {

    public class ShipOwnerValidator : AbstractValidator<ShipOwner> {

        public ShipOwnerValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Profession).NotNull().MaximumLength(128);
            RuleFor(x => x.Address).NotNull().MaximumLength(128);
            RuleFor(x => x.TaxNo).NotNull().MaximumLength(128);
            RuleFor(x => x.City).NotNull().MaximumLength(128);
            RuleFor(x => x.Phones).NotNull().MaximumLength(128);
            RuleFor(x => x.Email).NotNull().EmailAddress().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}