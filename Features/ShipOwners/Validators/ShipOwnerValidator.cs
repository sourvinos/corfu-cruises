using FluentValidation;

namespace CorfuCruises {

    public class ShipOwnerValidator : AbstractValidator<ShipOwner> {

        public ShipOwnerValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}