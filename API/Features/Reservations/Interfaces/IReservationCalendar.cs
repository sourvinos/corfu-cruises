using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Reservations {

    public interface IReservationCalendar : IRepository<Reservation> {

        Task<IEnumerable<ReservationCalendarGroupVM>> GetForCalendarAsync(string fromDate, string toDate);

    }

}