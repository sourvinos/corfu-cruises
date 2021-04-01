using FluentValidation;

namespace CorfuCruises {

    public class ReservationValidator : AbstractValidator<Reservation> {

        public ReservationValidator() {
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.TicketNo).NotNull().MaximumLength(128);
            RuleFor(x => x.Email).NotNull().EmailAddress().MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.Remarks).MaximumLength(128);
            RuleFor(x => x.Guid).NotEmpty().MaximumLength(36);
            RuleFor(x => x.DestinationId).NotEmpty();
            RuleFor(x => x.CustomerId).NotEmpty();
            RuleFor(x => x.PickupPointId).NotEmpty();
            RuleFor(x => x.PortId).NotEmpty();
            RuleFor(x => x.UserId).NotEmpty().MaximumLength(128);
            RuleForEach(x => x.Passengers).ChildRules(passenger => {
                passenger.RuleFor(x => x.Lastname).NotEmpty();
                passenger.RuleFor(x => x.Firstname).NotEmpty();
                passenger.RuleFor(x => x.DOB).NotEmpty();
                passenger.RuleFor(x => x.Remarks).MaximumLength(128);
                passenger.RuleFor(x => x.SpecialCare).MaximumLength(128);
            });
        }

    }

}