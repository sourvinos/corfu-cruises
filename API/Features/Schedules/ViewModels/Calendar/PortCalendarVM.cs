namespace API.Features.Schedules {

    public class PortCalendarVM {

        // Level 3 of 3

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public int MaxPax { get; set; }
        public int AccumulatedMaxPax { get; set; }
        public int Pax { get; set; }
        public int AccumulatedPax { get; set; }
        public int AccumulatedFreePax { get; set; }

    }

}