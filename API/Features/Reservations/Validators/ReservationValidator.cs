using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using FluentValidation;

namespace API.Features.Reservations {

    public class ReservationValidator : AbstractValidator<ReservationWriteResource> {

        public ReservationValidator() {
            // FKs
            RuleFor(x => x.CustomerId).NotEmpty().WithMessage(ApiMessages.FKNotFoundOrInactive("Customer Id"));
            RuleFor(x => x.DestinationId).NotEmpty().WithMessage(ApiMessages.FKNotFoundOrInactive("Destination Id"));
            RuleFor(x => x.PickupPointId).NotEmpty().WithMessage(ApiMessages.FKNotFoundOrInactive("Pickup point Id"));
            // Fields
            RuleFor(x => x.Date).Must(DateHelpers.BeCorrectFormat).WithMessage(ApiMessages.DateHasWrongFormat());
            RuleFor(x => x.Email).Must(EmailHelpers.BeEmptyOrValidEmailAddress).WithMessage(ApiMessages.EmailHasWrongFormat()).MaximumLength(128);
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