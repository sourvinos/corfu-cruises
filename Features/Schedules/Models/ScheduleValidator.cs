using FluentValidation;

namespace CorfuCruises {

    public class ScheduleValidator : AbstractValidator<Schedule> {

        public ScheduleValidator() {
            RuleFor(x => x.PortId).NotNull().NotEmpty();
            RuleFor(x => x.DestinationId).NotNull().NotEmpty();
            RuleFor(x => x.Date).NotNull().NotEmpty();
            RuleFor(x => x.MaxPersons).NotNull().NotEmpty().InclusiveBetween(0, 999);
            RuleFor(x => x.IsActive).NotNull();
            RuleFor(x => x.UserId).NotNull().NotEmpty().MaximumLength(128);
        }

    }

}