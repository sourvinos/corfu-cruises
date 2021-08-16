using FluentValidation;

namespace BlueWaterCruises.Features.Ships {

    public class RegistrarValidator : AbstractValidator<Registrar> {

        public RegistrarValidator() {
            RuleFor(x => x.ShipId).NotNull().NotEmpty();
            RuleFor(x => x.Fullname).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Phones).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Email).NotNull().NotEmpty().EmailAddress().MaximumLength(128);
            RuleFor(x => x.Fax).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Address).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsPrimary).NotNull();
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(36);
        }

    }

}