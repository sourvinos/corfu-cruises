using System;

namespace BlueWaterCruises.Features.Schedules {

    public class ReservationResource {

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public int TotalPersons { get; set; }

    }

}