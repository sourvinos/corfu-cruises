using BackEnd.UnitTests.Infrastructure;
using BlueWaterCruises.Features.Ships.Owners;
using BlueWaterCruises.Features.Ships.Registrars;
using FluentValidation.TestHelper;
using Xunit;

namespace BackEnd.UnitTests.Ships.Registrars {

    public class RegistrarTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateFullname))]
        public void Invalid_Fullaname(RegistrarWriteResource record) {
            new RegistrarValidator().ShouldHaveValidationErrorFor(model => model.Fullname, record.Fullname);
        }

        [Theory]
        [ClassData(typeof(ValidatePhones))]
        public void Invalid_Phones(RegistrarWriteResource record) {
            new RegistrarValidator().ShouldHaveValidationErrorFor(model => model.Phones, record.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidateFax))]
        public void Invalid_Fax(RegistrarWriteResource record) {
            new RegistrarValidator().ShouldHaveValidationErrorFor(model => model.Fax, record.Fax);
        }

        [Theory]
        [ClassData(typeof(ValidateAddress))]
        public void Invalid_Address(RegistrarWriteResource record) {
            new RegistrarValidator().ShouldHaveValidationErrorFor(model => model.Address, record.Address);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new ShipOwnerValidator().ShouldHaveValidationErrorFor(model => model.Email, email);
        }

    }

}