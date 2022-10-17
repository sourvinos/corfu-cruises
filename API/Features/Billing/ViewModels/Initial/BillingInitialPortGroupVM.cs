namespace API.Features.Billing {

    public class BillingInitialPortGroupVM {

        // Level 3

        public bool HasTransfer { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalPassengers { get; set; }

    }

}