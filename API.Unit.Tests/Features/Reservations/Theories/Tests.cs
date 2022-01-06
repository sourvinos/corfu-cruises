using API.Features.Reservations;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Reservations {

    public class ReservationTests : IClassFixture<AppSettingsFixture> {

        [Fact]
        public void Invalid_CustomerId() {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.CustomerId, 0);
        }

        [Fact]
        public void Invalid_DestinationId() {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.DestinationId, 0);
        }

        [Fact]
        public void Invalid_DriverId() {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.DriverId, 0);
        }

        [Fact]
        public void Invalid_PickupPointId() {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.PickupPointId, 0);
        }

        [Fact]
        public void Invalid_PortId() {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.PortId, 0);
        }

        [Fact]
        public void Invalid_ShipId() {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.ShipId, 0);
        }

        [Theory]
        [ClassData(typeof(InvalidDate))]
        public void Invalid_Date(string date) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.Date, date);
        }

        [Theory]
        [ClassData(typeof(InvalidTicketNo))]
        public void Invalid_TicketNo(string ticketNo) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.TicketNo, ticketNo);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.Email, email);
        }

        [Fact]
        public void Invalid_Phones() {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.Phones, Helpers.GetLongString());
        }

        [Fact]
        public void Invalid_Remarks() {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.Remarks, Helpers.GetLongString());
        }

    }

}