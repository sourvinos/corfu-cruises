using FluentValidation;

namespace BlueWaterCruises.Features.Ships.Base {

    public class ShipValidator : AbstractValidator<Ship> {

        public ShipValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.ShipOwnerId).NotNull();
            RuleFor(x => x.IMO).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Flag).NotEmpty().MaximumLength(128);
            RuleFor(x => x.RegistryNo).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Manager).NotEmpty().MaximumLength(128);
            RuleFor(x => x.ManagerInGreece).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Agent).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }

    }

}