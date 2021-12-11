using System.Text.RegularExpressions;
using BlueWaterCruises.Features.Vouchers;
using FluentValidation;

namespace BlueWaterCruises.Features.Reservations {

    public class VoucherValidator : AbstractValidator<Voucher> {

        public VoucherValidator() {
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.TicketNo).NotNull().MaximumLength(128);
            RuleFor(x => x.DestinationDescription).NotNull().MaximumLength(128);
            RuleFor(x => x.CustomerDescription).NotNull().MaximumLength(128);
            RuleFor(x => x.PickupPointDescription).NotNull().MaximumLength(128);
            RuleFor(x => x.PickupPointExactPoint).NotNull().MaximumLength(128);
            RuleFor(x => x.PickupPointTime).Must(IsTime);
            RuleFor(x => x.DriverDescription).NotNull().MaximumLength(128);
            RuleFor(x => x.Remarks).MaximumLength(128);
            RuleFor(x => x.Email).MaximumLength(128);
            RuleForEach(x => x.Passengers).ChildRules(passenger => {
                passenger.RuleFor(x => x.Lastname).NotEmpty().MaximumLength(128);
                passenger.RuleFor(x => x.Firstname).NotEmpty().MaximumLength(128);
            });
            RuleFor(x => x.Adults).NotEmpty();
            RuleFor(x => x.Kids).NotEmpty();
            RuleFor(x => x.Free).NotEmpty();
            RuleFor(x => x.TotalPersons).NotEmpty();
        }

        private bool IsTime(string time) {
            return new Regex("^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$").IsMatch(time);
        }

    }

}