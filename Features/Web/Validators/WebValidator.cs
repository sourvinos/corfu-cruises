using FluentValidation;

namespace CorfuCruises {

    public class WebValidator : AbstractValidator<Reservation> {

        public WebValidator() {
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.DestinationId).NotEmpty();
            RuleFor(x => x.PickupPointId).NotEmpty();
            RuleFor(x => x.Email).NotNull().EmailAddress().MaximumLength(128);
            RuleFor(x => x.Phones).MaximumLength(128);
            RuleFor(x => x.Adults).LessThanOrEqualTo(99);
            RuleFor(x => x.Kids).LessThanOrEqualTo(99);
            RuleFor(x => x.Free).LessThanOrEqualTo(99);
            RuleFor(x => x.Remarks).MaximumLength(128);
        }

    }

}