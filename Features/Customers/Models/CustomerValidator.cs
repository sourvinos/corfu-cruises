using FluentValidation;

namespace CorfuCruises {

    public class CustomerValidator : AbstractValidator<Customer> {

        public CustomerValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Profession).MaximumLength(128);
            RuleFor(x => x.Address).MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.PersonInCharge).MaximumLength(128);
            RuleFor(x => x.Email).MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}