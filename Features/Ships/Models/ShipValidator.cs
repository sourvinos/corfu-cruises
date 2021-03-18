using FluentValidation;

namespace CorfuCruises {

    public class ShipValidator : AbstractValidator<Ship> {

        public ShipValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IMO).NotNull().MaximumLength(128);
            RuleFor(x => x.Flag).NotNull().MaximumLength(128);
            RuleFor(x => x.RegistryNo).NotNull().MaximumLength(128);
            RuleFor(x => x.MaxPersons).NotNull().NotEmpty().InclusiveBetween(0, 999);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}