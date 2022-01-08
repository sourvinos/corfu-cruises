using API.Features.Reservations;
using API.Infrastructure.Helpers;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Reservations {

    public class ReservationTests : IClassFixture<AppSettingsFixture> {

        [Fact]
        public void Invalid_CustomerId() {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { CustomerId = 0 })
                .ShouldHaveValidationErrorFor(x => x.CustomerId).WithErrorMessage(ApiMessages.InvalidCustomerId());
        }

        [Fact]
        public void Invalid_DestinationId() {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { DestinationId = 0 })
                .ShouldHaveValidationErrorFor(x => x.DestinationId).WithErrorMessage(ApiMessages.InvalidDestinationId());
        }

        [Fact]
        public void Invalid_DriverId() {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { DriverId = 0 })
                .ShouldHaveValidationErrorFor(x => x.DriverId).WithErrorMessage(ApiMessages.InvalidDriverId());
        }

        [Fact]
        public void Invalid_PickupPointId() {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { PickupPointId = 0 })
                .ShouldHaveValidationErrorFor(x => x.PickupPointId).WithErrorMessage(ApiMessages.InvalidPickupPointId());
        }

        [Fact]
        public void Invalid_ShipId() {
            new ReservationValidator()
               .TestValidate(new ReservationWriteResource { ShipId = 0 })
               .ShouldHaveValidationErrorFor(x => x.ShipId).WithErrorMessage(ApiMessages.InvalidShipId());
        }

        [Theory]
        [ClassData(typeof(InvalidDate))]
        public void Invalid_Date(string date) {
            new ReservationValidator()
                .TestValidate(new ReservationWriteResource { Date = date })
                .ShouldHaveValidationErrorFor(x => x.Date).WithErrorMessage(ApiMessages.DateHasWrongFormat());
        }

        [Theory]
        [ClassData(typeof(InvalidTicketNo))]
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
               .ShouldHaveValidationErrorFor(x => x.Email);
        }

        [Fact]
        public void Invalid_Phones() {
            new ReservationValidator()
               .TestValidate(new ReservationWriteResource { Phones = Helpers.GetLongString() })
               .ShouldHaveValidationErrorFor(x => x.Phones);
        }

        [Fact]
        public void Invalid_Remarks() {
            new ReservationValidator()
               .TestValidate(new ReservationWriteResource { Remarks = Helpers.GetLongString() })
               .ShouldHaveValidationErrorFor(x => x.Remarks);
        }

    }

}