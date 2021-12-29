using FluentValidation;

namespace BlueWaterCruises.Features.Ships.Crews {

    public class CrewValidator : AbstractValidator<CrewWriteResource> {

        public CrewValidator() {
            RuleFor(x => x.ShipId).NotNull();
            RuleFor(x => x.NationalityId).NotNull();
            RuleFor(x => x.GenderId).NotNull();
            RuleFor(x => x.Lastname).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Firstname).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Birthdate).NotEmpty();
            RuleFor(x => x.IsActive).NotNull();
        }

    }

}