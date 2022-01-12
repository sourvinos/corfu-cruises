using API.Features.Ships.Crews;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Ships.Crews {

    public class CrewsTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_GenderId(int genderId) {
            new CrewValidator()
                .TestValidate(new CrewWriteResource { GenderId = genderId })
                .ShouldHaveValidationErrorFor(x => x.GenderId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_NationalityId(int nationalityId) {
            new CrewValidator()
                .TestValidate(new CrewWriteResource { NationalityId = nationalityId })
                .ShouldHaveValidationErrorFor(x => x.NationalityId);
        }

        [Theory]
        [ClassData(typeof(ValidateFK))]
        public void Invalid_ShipId(int shipId) {
            new CrewValidator()
                .TestValidate(new CrewWriteResource { ShipId = shipId })
                .ShouldHaveValidationErrorFor(x => x.ShipId);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        public void Invalid_Lastname(string lastname) {
            new CrewValidator()
                .TestValidate(new CrewWriteResource { Lastname = lastname })
                .ShouldHaveValidationErrorFor(x => x.Lastname);
        }

        [Theory]
        [ClassData(typeof(ValidateStringNotEmpty))]
        public void Invalid_Firstname(string firstname) {
            new CrewValidator()
                .TestValidate(new CrewWriteResource { Firstname = firstname })
                .ShouldHaveValidationErrorFor(x => x.Firstname);
        }

        [Theory]
        [ClassData(typeof(ValidateDate))]
        public void Invalid_Birthdate(string date) {
            new CrewValidator()
                .TestValidate(new CrewWriteResource { Birthdate = date })
                .ShouldHaveValidationErrorFor(x => x.Birthdate);
        }

    }

}