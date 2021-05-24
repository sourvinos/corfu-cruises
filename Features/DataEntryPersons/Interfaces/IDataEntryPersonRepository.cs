using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IDataEntryPersonRepository : IRepository<DataEntryPerson> {

        Task<IEnumerable<DataEntryPersonReadResource>> Get();
        new Task<DataEntryPerson> GetById(int dataEntryPersonId);

    }

}