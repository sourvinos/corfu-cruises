namespace CorfuCruises {

    public class ShipRoute {

        public int Id { get; set; }
        public string Description { get; set; }
        public string From { get; set; }
        public string Via { get; set; }
        public string To { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}