using BackEnd.UnitTests.Infrastructure;
using API.Features.Ships.Owners;
using FluentValidation.TestHelper;
using Xunit;

namespace BackEnd.UnitTests.Ships.Owners {

    public class ShipOwnerTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateDescription))]
        public void Invalid_Description(ShipOwnerWriteResource record) {
            new ShipOwnerValidator().ShouldHaveValidationErrorFor(model => model.Description, record.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateProfession))]
        public void Invalid_Profession(ShipOwnerWriteResource record) {
            new ShipOwnerValidator().ShouldHaveValidationErrorFor(model => model.Profession, record.Profession);
        }

        [Theory]
        [ClassData(typeof(ValidateAddress))]
        public void Invalid_Address(ShipOwnerWriteResource record) {
            new ShipOwnerValidator().ShouldHaveValidationErrorFor(model => model.Address, record.Address);
        }

        [Theory]
        [ClassData(typeof(ValidateTaxNo))]
        public void Invalid_TaxNo(ShipOwnerWriteResource record) {
            new ShipOwnerValidator().ShouldHaveValidationErrorFor(model => model.TaxNo, record.TaxNo);
        }

        [Theory]
        [ClassData(typeof(ValidateCity))]
        public void Invalid_City(ShipOwnerWriteResource record) {
            new ShipOwnerValidator().ShouldHaveValidationErrorFor(model => model.City, record.City);
        }

        [Theory]
        [ClassData(typeof(ValidatePhones))]
        public void Invalid_Phones(ShipOwnerWriteResource record) {
            new ShipOwnerValidator().ShouldHaveValidationErrorFor(model => model.Phones, record.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new ShipOwnerValidator().ShouldHaveValidationErrorFor(model => model.Email, email);
        }

    }

}