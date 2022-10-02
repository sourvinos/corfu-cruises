using System.Collections.Generic;

namespace API.Features.Reservations {

    public interface IReservationAvailability {

        IList<ReservationAvailabilityVM> CalculateAvailability(string date, int destinationId, int portId);

    }

}