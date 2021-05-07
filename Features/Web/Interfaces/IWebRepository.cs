using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IWebRepository : IRepository<Reservation> {

        Task<Reservation> GetById(string id);
        bool Update(string id, Reservation updatedRecord);

    }

}