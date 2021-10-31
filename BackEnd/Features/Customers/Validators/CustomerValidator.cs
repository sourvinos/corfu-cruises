using FluentValidation;

namespace BlueWaterCruises.Features.Customers {

    public class CustomerValidator : AbstractValidator<CustomerWriteResource> {

        public CustomerValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Profession).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Address).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Phones).NotEmpty().MaximumLength(128);
            RuleFor(x => x.PersonInCharge).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Email).EmailAddress().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }

    }

}