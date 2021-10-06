using System;

namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleResource {

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public string DestinationDescription { get; set; }
        public string DestinationAbbreviation { get; set; }
        public int PortId { get; set; }
        public string PortDescription { get; set; }
        public string PortAbbreviation { get; set; }
        public bool IsPortPrimary { get; set; }
        public int MaxPersons { get; set; }
        public int Persons { get; set; }

    }

}