using BlueWaterCruises.Infrastructure.Extensions;
using FluentValidation;

namespace BlueWaterCruises.Features.Customers {

    public class CustomerValidator : AbstractValidator<CustomerWriteResource> {

        public CustomerValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Profession).MaximumLength(128);
            RuleFor(x => x.Address).MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.PersonInCharge).MaximumLength(128);
            RuleFor(x => x.Email).Must(EmailHelpers.BeEmptyOrValidEmailAddress).MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
        }

    }

}