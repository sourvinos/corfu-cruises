using System;
using System.Collections.Generic;

namespace BlueWaterCruises.Features.Vouchers {

    public class Voucher {

        public string Logo { get; set; }

        public DateTime Date { get; set; }
        public string TicketNo { get; set; }
        public string DestinationDescription { get; set; }
        public string CustomerDescription { get; set; }
        public string PickupPointDescription { get; set; }
        public string PickupPointExactPoint { get; set; }
        public string PickupPointTime { get; set; }
        public string DriverDescription { get; set; }
        public string Remarks { get; set; }
        public string BarCode { get; set; }
        public string Email { get; set; }

        public List<Passenger> Passengers { get; set; }

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string ValidPassengerIcon { get; set; }

        public string Facebook { get; set; }
        public string YouTube { get; set; }
        public string Instagram { get; set; }

    }

}