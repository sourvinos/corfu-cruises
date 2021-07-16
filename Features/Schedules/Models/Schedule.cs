using System;

namespace ShipCruises {

    public class Schedule {

        public int Id { get; set; }
        public int PortId { get; set; }
        public int DestinationId { get; set; }
        public string Date { get; set; }
        public int MaxPersons { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public Port Port { get; set; }
        public Destination Destination { get; set; }

    }

}