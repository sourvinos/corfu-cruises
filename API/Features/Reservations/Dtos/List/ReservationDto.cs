using System.Collections.Generic;

namespace API.Features.Reservations {

    public class ReservationDto<T> {

        public int Persons { get; set; }
        public IEnumerable<ReservationListDto> Reservations { get; set; }

    }

}