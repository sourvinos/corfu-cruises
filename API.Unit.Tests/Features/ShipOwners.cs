using API.Features.ShipOwners;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.ShipOwners {

    public class ShipOwners : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Description(string description) {
            new ShipOwnerValidator()
                .TestValidate(new ShipOwnerWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Profession(string profession) {
            new ShipOwnerValidator()
                .TestValidate(new ShipOwnerWriteResource { Profession = profession })
                .ShouldHaveValidationErrorFor(x => x.Profession);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Address(string address) {
            new ShipOwnerValidator()
                .TestValidate(new ShipOwnerWriteResource { Address = address })
                .ShouldHaveValidationErrorFor(x => x.Address);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_TaxNo(string taxNo) {
            new ShipOwnerValidator()
                .TestValidate(new ShipOwnerWriteResource { TaxNo = taxNo })
                .ShouldHaveValidationErrorFor(x => x.TaxNo);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_City(string city) {
            new ShipOwnerValidator()
                .TestValidate(new ShipOwnerWriteResource { City = city })
                .ShouldHaveValidationErrorFor(x => x.City);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Phones(string phones) {
            new ShipOwnerValidator()
                .TestValidate(new ShipOwnerWriteResource { Phones = phones })
                .ShouldHaveValidationErrorFor(x => x.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new ShipOwnerValidator()
                .TestValidate(new ShipOwnerWriteResource { Email = email })
                .ShouldHaveValidationErrorFor(x => x.Email);
        }

    }

}