using System;

namespace API.Features.Reservations {

    public class ReservationListVM {

        public Guid ReservationId { get; set; }

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public int DriverId { get; set; }
        public string RefNo { get; set; }
        public string TicketNo { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string Time { get; set; }
        public string Remarks { get; set; }

        public string CustomerDescription { get; set; }
        public string DestinationAbbreviation { get; set; }
        public string DestinationDescription { get; set; }
        public string DriverDescription { get; set; }
        public string PickupPointDescription { get; set; }
        public string CoachRouteAbbreviation { get; set; }
        public string PortDescription { get; set; }
        public string ShipDescription { get; set; }

        public int PassengerCount { get; set; }
        public int PassengerDifference { get; set; }

    }

}