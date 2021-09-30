namespace BlueWaterCruises.Features.Nationalities {

    public class Nationality : SimpleResource {

        public string Code { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}