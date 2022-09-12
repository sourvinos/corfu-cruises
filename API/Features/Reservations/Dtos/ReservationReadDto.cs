using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Reservations {

    public class ReservationReadDto {

        public string ReservationId { get; set; }

        public string Date { get; set; }
        public string RefNo { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }
        public string UserId { get; set; }

        public SimpleResource Customer { get; set; }
        public SimpleResource Destination { get; set; }
        public PickupPointWithPortVM PickupPoint { get; set; }
        public SimpleResource Driver { get; set; }
        public SimpleResource Ship { get; set; }

        public List<PassengerReadDto> Passengers { get; set; }

    }

}