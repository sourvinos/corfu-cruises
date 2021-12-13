using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Ships.Crews {

    public class CrewReadResource {

        public int Id { get; set; }
        public SimpleResource Ship { get; set; }
        public SimpleResource Nationality { get; set; }
        public SimpleResource Gender { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public bool IsActive { get; set; }

    }

}