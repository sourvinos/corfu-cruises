using API.Features.Customers;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Customers {

    public class CustomerTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Description(string description) {
            new CustomerValidator()
                .TestValidate(new CustomerWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Profession(string profession) {
            new CustomerValidator()
               .TestValidate(new CustomerWriteResource { Profession = profession })
               .ShouldHaveValidationErrorFor(x => x.Profession);
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Address(string address) {
            new CustomerValidator()
                .TestValidate(new CustomerWriteResource { Address = address })
                .ShouldHaveValidationErrorFor(x => x.Address);
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Phones(string phones) {
            new CustomerValidator()
               .TestValidate(new CustomerWriteResource { Phones = phones })
               .ShouldHaveValidationErrorFor(x => x.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_PersonInCharge(string personInCharge) {
            new CustomerValidator()
                .TestValidate(new CustomerWriteResource { PersonInCharge = personInCharge })
                .ShouldHaveValidationErrorFor(x => x.PersonInCharge);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new CustomerValidator()
               .TestValidate(new CustomerWriteResource { Email = email })
               .ShouldHaveValidationErrorFor(x => x.Email);
        }

    }

}