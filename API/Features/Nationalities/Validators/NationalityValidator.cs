using FluentValidation;

namespace API.Features.Nationalities {

    public class NationalityValidator : AbstractValidator<NationalityWriteResource> {

        public NationalityValidator() {
            RuleFor(x => x.Code).NotEmpty().MaximumLength(10);
            RuleFor(x => x.Description).NotEmpty().MaximumLength(128);
            RuleFor(x => x.IsActive).NotNull();
        }

    }

}