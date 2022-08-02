using System.Collections.Generic;

namespace API.Features.Reservations {

    public class DriverDto<T> {

        public string Date { get; set; }
        public int DriverId { get; set; }
        public string DriverDescription { get; set; }
        public string Phones { get; set; }

        public IEnumerable<DriverListDto> Reservations { get; set; }

    }

}