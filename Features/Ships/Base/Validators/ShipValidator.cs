using FluentValidation;

namespace ShipCruises.Features.Ships {

    public class ShipValidator : AbstractValidator<Ship> {

        public ShipValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.ShipOwnerId).NotNull().NotEmpty();
            RuleFor(x => x.IMO).NotNull().MaximumLength(128);
            RuleFor(x => x.Flag).NotNull().MaximumLength(128);
            RuleFor(x => x.RegistryNo).NotNull().MaximumLength(128);
            RuleFor(x => x.Manager).NotNull().MaximumLength(128);
            RuleFor(x => x.ManagerInGreece).NotNull().MaximumLength(128);
            RuleFor(x => x.Agent).NotNull().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}