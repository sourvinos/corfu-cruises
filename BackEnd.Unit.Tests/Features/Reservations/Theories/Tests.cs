using BlueWaterCruises.Features.Reservations;
using FluentValidation.TestHelper;
using Xunit;

namespace BackEnd.UnitTests.Reservations {

    public class ReservationTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(InvalidDate))]
        public void Invalid_Date(ReservationWriteResource record) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.Date, record.Date);
        }

        [Theory]
        [ClassData(typeof(InvalidEmail))]
        public void Invalid_Email(ReservationWriteResource record) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.Email, record.Email);
        }

        [Theory]
        [ClassData(typeof(InvalidPhones))]
        public void Invalid_Phones(ReservationWriteResource record) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.Phones, record.Phones);
        }

        [Theory]
        [ClassData(typeof(InvalidRemarks))]
        public void Invalid_Remarks(ReservationWriteResource record) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.Remarks, record.Remarks);
        }

        [Theory]
        [ClassData(typeof(InvalidTicketNo))]
        public void Invalid_TicketNo(ReservationWriteResource record) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.TicketNo, record.TicketNo);
        }

        [Theory]
        [ClassData(typeof(InvalidCustomerId))]
        public void Invalid_CustomerId(ReservationWriteResource record) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.CustomerId, record.CustomerId);
        }

        [Theory]
        [ClassData(typeof(InvalidDestinationId))]
        public void Invalid_DestinationId(ReservationWriteResource record) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.DestinationId, record.DestinationId);
        }

        [Theory]
        [ClassData(typeof(InvalidPickupPointId))]
        public void Invalid_PickupPointId(ReservationWriteResource record) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.PickupPointId, record.PickupPointId);
        }

        [Theory]
        [ClassData(typeof(InvalidPortId))]
        public void Invalid_PortId(ReservationWriteResource record) {
            new ReservationValidator().ShouldHaveValidationErrorFor(model => model.PortId, record.PortId);
        }

    }

}