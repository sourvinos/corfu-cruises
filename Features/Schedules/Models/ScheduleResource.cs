using System;
using System.ComponentModel.DataAnnotations;

namespace CorfuCruises {

    public class ScheduleResource {


        public DateTime Date { get; set; }
        public int PortId { get; set; }

        public int DestinationId { get; set; }

        public int MaxPersons { get; set; }

        public bool IsActive { get; set; }

        public string UserId { get; set; }

    }

}