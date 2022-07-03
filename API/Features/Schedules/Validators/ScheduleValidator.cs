using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Schedules {

    public class ScheduleValidator : AbstractValidator<ScheduleWriteDto> {

        public ScheduleValidator() {
            // FKs
            RuleFor(x => x.PortId).NotEmpty();
            RuleFor(x => x.DestinationId).NotEmpty();
            // Fields
            RuleFor(x => x.Date).Must(DateHelpers.BeCorrectFormat);
            RuleFor(x => x.MaxPassengers).InclusiveBetween(0, 999);
            RuleFor(x => x.DepartureTime).Must(TimeHelpers.BeValidTime);
        }

    }

}