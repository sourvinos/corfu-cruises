using System;
using API.Features.Destinations;
using API.Features.Ports;
using API.Infrastructure.Identity;

namespace API.Features.Schedules {

    public class Schedule {

        // PK
        public int Id { get; set; }
        // FKs
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        // Fields
        public DateTime Date { get; set; }
        public int MaxPassengers { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public Destination Destination { get; set; }
        public Port Port { get; set; }
        public UserExtended User { get; set; }

    }

}