using API.Features.Ships.Base;
using API.UnitTests.Infrastructure;
using FluentValidation.TestHelper;
using Xunit;

namespace API.UnitTests.Ships.Base {

    public class ShipTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateDescription))]
        public void Invalid_Description(string description) {
            new ShipValidator()
                .TestValidate(new ShipWriteResource { Description = description })
                .ShouldHaveValidationErrorFor(x => x.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateIMO))]
        public void Invalid_IMO(string imo) {
            new ShipValidator()
                .TestValidate(new ShipWriteResource { IMO = imo })
                .ShouldHaveValidationErrorFor(x => x.IMO);
        }

        [Theory]
        [ClassData(typeof(ValidateFlag))]
        public void Invalid_Flag(string flag) {
            new ShipValidator()
                .TestValidate(new ShipWriteResource { Flag = flag })
                .ShouldHaveValidationErrorFor(x => x.Flag);
        }

        [Theory]
        [ClassData(typeof(ValidateRegistryNo))]
        public void Invalid_RegistryNo(string registryNo) {
            new ShipValidator()
                .TestValidate(new ShipWriteResource { RegistryNo = registryNo })
                .ShouldHaveValidationErrorFor(x => x.RegistryNo);
        }

        [Theory]
        [ClassData(typeof(ValidateManager))]
        public void Invalid_Manager(string manager) {
            new ShipValidator()
                .TestValidate(new ShipWriteResource { Manager = manager })
                .ShouldHaveValidationErrorFor(x => x.Manager);
        }

        [Theory]
        [ClassData(typeof(ValidateManagerInGreece))]
        public void Invalid_ManagerInGreece(string managerInGreece) {
            new ShipValidator()
                .TestValidate(new ShipWriteResource { ManagerInGreece = managerInGreece })
                .ShouldHaveValidationErrorFor(x => x.ManagerInGreece);
        }

        [Theory]
        [ClassData(typeof(ValidateAgent))]
        public void Invalid_Agent(string agent) {
            new ShipValidator()
                .TestValidate(new ShipWriteResource { Agent = agent })
                .ShouldHaveValidationErrorFor(x => x.Agent);
        }

    }

}