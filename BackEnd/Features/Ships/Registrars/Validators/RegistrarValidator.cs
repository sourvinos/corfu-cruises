using FluentValidation;

namespace BlueWaterCruises.Features.Ships.Registrars {

    public class RegistrarValidator : AbstractValidator<RegistrarWriteResource> {

        public RegistrarValidator() {
            RuleFor(x => x.ShipId).NotNull();
            RuleFor(x => x.Fullname).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Phones).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(128);
            RuleFor(x => x.Fax).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Address).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsPrimary).NotNull();
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }

    }

}