using FluentValidation;

namespace BlueWaterCruises.Features.Reservations {

    public class ReservationValidator : AbstractValidator<ReservationWriteResource> {

        public ReservationValidator() {
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.TicketNo).NotNull().MaximumLength(128);
            RuleFor(x => x.Email).NotNull().EmailAddress().MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.Remarks).MaximumLength(128);
            RuleFor(x => x.DestinationId).NotEmpty();
            RuleFor(x => x.CustomerId).NotEmpty();
            RuleFor(x => x.PickupPointId).NotEmpty();
            RuleFor(x => x.PortId).NotEmpty();
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