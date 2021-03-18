using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CorfuCruises {

    public class SaveTripResource {

        [Key]
        public int MasterId { get; set; }
        public string TripDate { get; set; }
        public int DestinationId { get; set; }
        public int CustomerId { get; set; }
        public int PickupPointId { get; set; }
        public int ShipId { get; set; }
        public int DriverId { get; set; }
        public int PortId { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string UserId { get; set; }

        public List<SaveDetailResource> Details { get; set; }

        public SaveTripResource() {
            Details = new List<SaveDetailResource>();
        }

    }

}