using FluentValidation;

namespace BlueWaterCruises.Features.Ships {

    public class CrewValidator : AbstractValidator<Crew> {

        public CrewValidator() {
            RuleFor(x => x.Lastname).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Firstname).NotNull().NotEmpty().MaximumLength(128);
            RuleFor(x => x.Birthdate).NotNull().NotEmpty().MaximumLength(10);
            RuleFor(x => x.NationalityId).NotNull().NotEmpty();
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}