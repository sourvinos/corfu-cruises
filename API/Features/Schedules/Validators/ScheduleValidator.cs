using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Schedules {

    public class ScheduleValidator : AbstractValidator<ScheduleWriteResource> {

        public ScheduleValidator() {
            // FKs
            RuleFor(x => x.PortId).NotEmpty();
            RuleFor(x => x.DestinationId).NotEmpty();
            // Fields
            RuleFor(x => x.Date).Must(DateHelpers.BeCorrectFormat).WithMessage(ApiMessages.DateHasWrongFormat());
            RuleFor(x => x.MaxPersons).NotEmpty().InclusiveBetween(1, 999).WithMessage(ApiMessages.InvalidMaxPersons());
        }

    }

}