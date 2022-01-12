using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Ships.Owners {

    public class ShipOwnerValidator : AbstractValidator<ShipOwnerWriteResource> {

        public ShipOwnerValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Profession).MaximumLength(128);
            RuleFor(x => x.Address).MaximumLength(128);
            RuleFor(x => x.TaxNo).MaximumLength(128);
            RuleFor(x => x.City).MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.Email).Must(EmailHelpers.BeEmptyOrValidEmailAddress).MaximumLength(128);
        }

    }

}