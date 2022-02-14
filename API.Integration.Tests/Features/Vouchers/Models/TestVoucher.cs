using System.Collections.Generic;
using API.Integration.Tests.Infrastructure;

namespace API.Integration.Tests.Vouchers {

    public class TestVoucher : ITestEntity {

        public int Id { get; set; }
        public string Logo { get; set; }
        public string Date { get; set; } = "2022-02-01";
        public string TicketNo { get; set; } = "TUI1701";
        public string DestinationDescription { get; set; } = "DEFAULT DESTINATION";
        public string CustomerDescription { get; set; } = "DEFAULT CUSTOMER";
        public string PickupPointDescription { get; set; } = "DEFAULT PICKUP POINT";
        public string PickupPointExactPoint { get; set; } = "DEFAULT EXACT POINT";
        public string PickupPointTime { get; set; } = "00:00";
        public string DriverDescription { get; set; } = "DEFAULT DRIVER";
        public string Remarks { get; set; } = "DEFAULT REMARKS";
        public string BarCode { get; set; } = "";
        public string Email { get; set; } = "email@server.com";
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string ValidPassengerIcon { get; set; }
        public string Facebook { get; set; } = "FACEBOOK";
        public string YouTube { get; set; } = "YOUTUBE";
        public string Instagram { get; set; } = "INSTAGRAM";

        public List<TestPassenger> Passengers { get; set; } = CreatePassengers();

        private static List<TestPassenger> CreatePassengers() {
            return new List<TestPassenger> {
                new TestPassenger { Lastname = "DOE", Firstname = "JOHN" },
                new TestPassenger { Lastname = "SMITH", Firstname = "JANE" }
            };
        }

    }

}
