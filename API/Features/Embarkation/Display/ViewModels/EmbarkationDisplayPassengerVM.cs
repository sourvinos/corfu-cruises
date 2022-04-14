namespace API.Features.Embarkation.Display {

    public class EmbarkationDisplayPassengerVM {

        public int Id { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string NationalityCode { get; set; }
        public string NationalityDescription { get; set; }
        public bool IsCheckedIn { get; set; }

    }

}