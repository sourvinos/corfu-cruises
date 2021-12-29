using FluentValidation;

namespace BlueWaterCruises.Features.Ships.Base {

    public class ShipValidator : AbstractValidator<ShipWriteResource> {

        public ShipValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.ShipOwnerId).NotNull();
            RuleFor(x => x.IMO).MaximumLength(128);
            RuleFor(x => x.Flag).MaximumLength(128);
            RuleFor(x => x.RegistryNo).MaximumLength(128);
            RuleFor(x => x.Manager).MaximumLength(128);
            RuleFor(x => x.ManagerInGreece).MaximumLength(128);
            RuleFor(x => x.Agent).MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
        }

    }

}