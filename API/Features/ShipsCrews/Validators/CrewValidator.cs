using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.ShipsCrews {

    public class CrewValidator : AbstractValidator<CrewWriteResource> {

        public CrewValidator() {
            RuleFor(x => x.GenderId).NotEmpty();
            RuleFor(x => x.NationalityId).NotEmpty();
            RuleFor(x => x.ShipId).NotEmpty();
            RuleFor(x => x.Lastname).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Firstname).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Birthdate).Must(DateHelpers.BeCorrectFormat).WithMessage(ApiMessages.DateHasWrongFormat());
        }

    }

}