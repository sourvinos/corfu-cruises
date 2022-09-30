using System.Collections.Generic;

namespace API.Features.Availability {

    public interface IAvailabilityRepository {

        IList<ScheduleVM> CalculateFreeSeats(string fromDate, string toDate);

    }

}