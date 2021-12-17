using BlueWaterCruises.Features.Customers;
using FluentValidation.TestHelper;
using Xunit;

namespace BackEnd.UnitTests.Customers {

    public class CustomerTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateDescription))]
        public void Invalid_Description(CustomerWriteResource record) {
            new CustomerValidator().ShouldHaveValidationErrorFor(model => model.Description, record.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateProfession))]
        public void Invalid_Profession(CustomerWriteResource record) {
            new CustomerValidator().ShouldHaveValidationErrorFor(model => model.Profession, record.Profession);
        }

        [Theory]
        [ClassData(typeof(ValidateAddress))]
        public void Invalid_Address(CustomerWriteResource record) {
            new CustomerValidator().ShouldHaveValidationErrorFor(model => model.Address, record.Address);
        }

        [Theory]
        [ClassData(typeof(ValidatePhones))]
        public void Invalid_Phones(CustomerWriteResource record) {
            new CustomerValidator().ShouldHaveValidationErrorFor(model => model.Phones, record.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidatePersonInCharge))]
        public void Invalid_PersonInCharge(CustomerWriteResource customer) {
            new CustomerValidator().ShouldHaveValidationErrorFor(model => model.PersonInCharge, customer.PersonInCharge);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(CustomerWriteResource customer) {
            new CustomerValidator().ShouldHaveValidationErrorFor(model => model.Email, customer.Email);
        }

    }

}