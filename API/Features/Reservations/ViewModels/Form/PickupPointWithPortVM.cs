using API.Infrastructure.Classes;

namespace API.Features.Reservations {

    public class PickupPointWithPortVM {

        public int Id { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public SimpleResource Port { get; set; }

    }

}