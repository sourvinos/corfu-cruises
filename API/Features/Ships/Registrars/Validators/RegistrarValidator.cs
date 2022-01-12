using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Ships.Registrars {

    public class RegistrarValidator : AbstractValidator<RegistrarWriteResource> {

        public RegistrarValidator() {
            RuleFor(x => x.ShipId).NotNull();
            RuleFor(x => x.Fullname).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.Email).Must(EmailHelpers.BeEmptyOrValidEmailAddress).MaximumLength(128);
            RuleFor(x => x.Fax).MaximumLength(128);
            RuleFor(x => x.Address).MaximumLength(128);
            RuleFor(x => x.IsPrimary).NotNull();
        }

    }

}