namespace API.Features.Invoicing {

    public class HasTransferGroupViewModel {

        public bool HasTransfer { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
    }

}