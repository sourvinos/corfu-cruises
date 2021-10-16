namespace BlueWaterCruises.Features.Customers {

    public class CustomerReadResource : SimpleResource {

        public string Profession { get; set; }
        public string Address { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }

    }

}