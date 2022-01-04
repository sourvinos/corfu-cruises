using FluentValidation;

namespace API.Features.Genders {

    public class GenderValidator : AbstractValidator<GenderWriteResource> {

        public GenderValidator() {
            RuleFor(x => x.Description).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}