using System.Collections.Generic;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationCalendar : IRepository<Reservation> {

        IEnumerable<ReservationCalendarGroupVM> GetForCalendar(string fromDate, string toDate);

    }

}