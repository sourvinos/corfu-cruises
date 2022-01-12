using API.Features.Reservations;
using API.Infrastructure.Helpers;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Reservations {

    public class ReservationTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_CustomerId(int customerId) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { CustomerId = customerId })
                .ShouldHaveValidationErrorFor(x => x.CustomerId)
                .WithErrorMessage(ApiMessages.FKNotFoundOrInactive("Customer Id"));
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_DestinationId(int destinationId) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { DestinationId = destinationId })
                .ShouldHaveValidationErrorFor(x => x.DestinationId)
                .WithErrorMessage(ApiMessages.FKNotFoundOrInactive("Destination Id"));
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_PickupPointId(int pickupPointId) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { PickupPointId = pickupPointId })
                .ShouldHaveValidationErrorFor(x => x.PickupPointId)
                .WithErrorMessage(ApiMessages.FKNotFoundOrInactive("Pickup point Id"));
        }

        [Theory]
        [ClassData(typeof(ValidateDate))]
        public void Invalid_Date(string date) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { Date = date })
                .ShouldHaveValidationErrorFor(x => x.Date)
                .WithErrorMessage(ApiMessages.DateHasWrongFormat());
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_TicketNo(string ticketNo) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { TicketNo = ticketNo })
                .ShouldHaveValidationErrorFor(x => x.TicketNo);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new ReservationValidator()
               .TestValidate(new ReservationWriteResource { Email = email })
               .ShouldHaveValidationErrorFor(x => x.Email)
               .WithErrorMessage(ApiMessages.EmailHasWrongFormat());
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Phones(string phones) {
            new ReservationValidator()
               .TestValidate(new ReservationWriteResource { Phones = phones })
               .ShouldHaveValidationErrorFor(x => x.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Remarks(string remarks) {
            new ReservationValidator()
               .TestValidate(new ReservationWriteResource { Remarks = remarks })
               .ShouldHaveValidationErrorFor(x => x.Remarks);
        }

    }

}