using System.Collections.Generic;

namespace API.Features.Availability {

    public interface IAvailabilityRepository {

        IEnumerable<AvailabilityVM> DoCalendarTasks(string fromDate, string toDate);

    }

}