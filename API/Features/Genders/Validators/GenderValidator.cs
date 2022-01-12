using FluentValidation;

namespace API.Features.Genders {

    public class GenderValidator : AbstractValidator<GenderWriteResource> {

        public GenderValidator() {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
        }

    }

}