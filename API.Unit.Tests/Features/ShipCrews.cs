using API.Features.ShipCrews;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Features.ShipCrews {

    public class ShipCrews : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_GenderId(int genderId) {
            new ShipCrewValidator()
                .TestValidate(new ShipCrewWriteResource { GenderId = genderId })
                .ShouldHaveValidationErrorFor(x => x.GenderId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_NationalityId(int nationalityId) {
            new ShipCrewValidator()
                .TestValidate(new ShipCrewWriteResource { NationalityId = nationalityId })
                .ShouldHaveValidationErrorFor(x => x.NationalityId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_ShipId(int shipId) {
            new ShipCrewValidator()
                .TestValidate(new ShipCrewWriteResource { ShipId = shipId })
                .ShouldHaveValidationErrorFor(x => x.ShipId);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Lastname(string lastname) {
            new ShipCrewValidator()
                .TestValidate(new ShipCrewWriteResource { Lastname = lastname })
                .ShouldHaveValidationErrorFor(x => x.Lastname);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        [ClassData(typeof(ValidateStringNotLongerThanMaxLength))]
        public void Invalid_Firstname(string firstname) {
            new ShipCrewValidator()
                .TestValidate(new ShipCrewWriteResource { Firstname = firstname })
                .ShouldHaveValidationErrorFor(x => x.Firstname);
        }

        [Theory]
        [ClassData(typeof(ValidateDate))]
        public void Invalid_Birthdate(string birthdate) {
            new ShipCrewValidator()
                .TestValidate(new ShipCrewWriteResource { Birthdate = birthdate })
                .ShouldHaveValidationErrorFor(x => x.Birthdate);
        }

    }

}