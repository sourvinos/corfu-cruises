using System;
using BlueWaterCruises.Features.Destinations;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Schedules {

    public class Schedule {

        // PK
        public int Id { get; set; }
        // Fields
        public DateTime Date { get; set; }
        public int MaxPersons { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public int DestinationId { get; set; }
        public int PortId { get; set; }
        public string UserId { get; set; }
        // Navigation
        public Destination Destination { get; set; }
        public Port Port { get; set; }
        public AppUser User { get; set; }

    }

}