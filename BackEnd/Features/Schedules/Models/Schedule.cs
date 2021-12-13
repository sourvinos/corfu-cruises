using System;
using BlueWaterCruises.Features.Destinations;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Schedules {

    public class Schedule {

        public int Id { get; set; }
        public int PortId { get; set; }
        public int DestinationId { get; set; }
        public DateTime Date { get; set; }
        public int MaxPersons { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public Destination Destination { get; set; }
        public Port Port { get; set; }

        public AppUser User { get; set; }

    }

}