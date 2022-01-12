using API.Features.Ships.Registrars;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.Registrars {

    public class Registrars : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_ShipId(int shipId) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteResource { ShipId = shipId })
                .ShouldHaveValidationErrorFor(x => x.ShipId);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Fullname(string fullname) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteResource { Fullname = fullname })
                .ShouldHaveValidationErrorFor(x => x.Fullname);
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Phones(string phones) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteResource { Phones = phones })
                .ShouldHaveValidationErrorFor(x => x.Phones);
        }

        [Theory]
        [ClassData(typeof(ValidateEmail))]
        public void Invalid_Email(string email) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteResource { Email = email })
                .ShouldHaveValidationErrorFor(x => x.Email);
        }

       [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Fax(string fax) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteResource { Fax = fax })
                .ShouldHaveValidationErrorFor(x => x.Fax);
        }

        [Theory]
        [ClassData(typeof(ValidateStringMaxLength))]
        public void Invalid_Address(string address) {
            new RegistrarValidator()
                .TestValidate(new RegistrarWriteResource { Address = address })
                .ShouldHaveValidationErrorFor(x => x.Address);
        }

     }

}