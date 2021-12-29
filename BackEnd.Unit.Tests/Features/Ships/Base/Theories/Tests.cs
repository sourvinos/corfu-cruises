using BackEnd.UnitTests.Infrastructure;
using BlueWaterCruises.Features.Ships.Base;
using FluentValidation.TestHelper;
using Xunit;

namespace BackEnd.UnitTests.Ships.Base {

    public class ShipTests : IClassFixture<AppSettingsFixture> {

        [Theory]
        [ClassData(typeof(ValidateDescription))]
        public void Invalid_Description(ShipWriteResource record) {
            new ShipValidator().ShouldHaveValidationErrorFor(model => model.Description, record.Description);
        }

        [Theory]
        [ClassData(typeof(ValidateIMO))]
        public void Invalid_IMO(ShipWriteResource record) {
            new ShipValidator().ShouldHaveValidationErrorFor(model => model.IMO, record.IMO);
        }

        [Theory]
        [ClassData(typeof(ValidateFlag))]
        public void Invalid_Flag(ShipWriteResource record) {
            new ShipValidator().ShouldHaveValidationErrorFor(model => model.Flag, record.Flag);
        }

        [Theory]
        [ClassData(typeof(ValidateRegistryNo))]
        public void Invalid_RegistryNo(ShipWriteResource record) {
            new ShipValidator().ShouldHaveValidationErrorFor(model => model.RegistryNo, record.RegistryNo);
        }

        [Theory]
        [ClassData(typeof(ValidateManager))]
        public void Invalid_Manager(ShipWriteResource record) {
            new ShipValidator().ShouldHaveValidationErrorFor(model => model.Manager, record.Manager);
        }

        [Theory]
        [ClassData(typeof(ValidateManagerInGreece))]
        public void Invalid_ManagerInGreece(ShipWriteResource record) {
            new ShipValidator().ShouldHaveValidationErrorFor(model => model.ManagerInGreece, record.ManagerInGreece);
        }

        [Theory]
        [ClassData(typeof(ValidateAgent))]
        public void Invalid_Agent(ShipWriteResource record) {
            new ShipValidator().ShouldHaveValidationErrorFor(model => model.Agent, record.Agent);
        }

    }

}