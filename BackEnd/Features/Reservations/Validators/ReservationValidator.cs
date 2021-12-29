using BlueWaterCruises.Infrastructure.Helpers;
using FluentValidation;

namespace BlueWaterCruises.Features.Reservations {

    public class ReservationValidator : AbstractValidator<ReservationWriteResource> {

        public ReservationValidator() {
            // FKs
            RuleFor(x => x.CustomerId).NotEmpty();
            RuleFor(x => x.DestinationId).NotEmpty();
            RuleFor(x => x.DriverId).NotEmpty();
            RuleFor(x => x.PickupPointId).NotEmpty();
            RuleFor(x => x.PortId).NotEmpty();
            RuleFor(x => x.ShipId).NotEmpty();
            // Fields
            RuleFor(x => x.Date).Must(DateHelpers.BeValidDateAndGreaterThatToday);
            RuleFor(x => x.Email).Must(EmailHelpers.BeEmptyOrValidEmailAddress).MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.Remarks).MaximumLength(128);
            RuleFor(x => x.TicketNo).NotEmpty().MaximumLength(128);
            // Passengers
            RuleForEach(x => x.Passengers).ChildRules(passenger => {
                passenger.RuleFor(x => x.Lastname).NotEmpty().MaximumLength(128);
                passenger.RuleFor(x => x.Firstname).NotEmpty().MaximumLength(128);
                passenger.RuleFor(x => x.Birthdate).NotEmpty();
                passenger.RuleFor(x => x.Remarks).MaximumLength(128);
                passenger.RuleFor(x => x.SpecialCare).MaximumLength(128);
            });
        }

    }

}