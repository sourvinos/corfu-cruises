using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Vouchers {

    public class TestVoucher : Login {

        public string FeatureUrl { get; set; } = "/vouchers";
        public string ActionUrl { get; set; } = "/create";
        public int ExpectedResponseCode { get; set; }
        public string Logo { get; set; }
        public string Date { get; set; } = "2021-10-01";
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

        public List<Passenger> Passengers { get; set; } = CreatePassengers();

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string ValidPassengerIcon { get; set; }

        public string Facebook { get; set; } = "FACEBOOK";
        public string YouTube { get; set; } = "YOUTUBE";
        public string Instagram { get; set; } = "INSTAGRAM";

        public string FullUrl() {
            return FeatureUrl + ActionUrl;
        }

        private static List<Passenger> CreatePassengers() {
            return new List<Passenger> {
                new Passenger { Lastname = "DOE", Firstname = "JOHN" },
                new Passenger { Lastname = "SMITH", Firstname = "JANE" }
            };
        }

    }

}
