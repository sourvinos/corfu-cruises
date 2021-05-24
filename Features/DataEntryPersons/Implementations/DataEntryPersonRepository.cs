using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class DataEntryPersonRepository : Repository<DataEntryPerson>, IDataEntryPersonRepository {

        private readonly IMapper mapper;
        public DataEntryPersonRepository(DbContext context) : base(context) { }

        public DataEntryPersonRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        async Task<IEnumerable<DataEntryPersonReadResource>> IDataEntryPersonRepository.Get() {
            var dataEntryPersons = await context.DataEntryPersons
                .Include(x => x.Ship)
                .ToListAsync();
            return mapper.Map<IEnumerable<DataEntryPerson>, IEnumerable<DataEntryPersonReadResource>>(dataEntryPersons);
        }

        public new async Task<DataEntryPerson> GetById(int dataEntryPersonId) {
            var dataEntryPerson = await context.DataEntryPersons
                .Include(x => x.Ship)
                .SingleOrDefaultAsync(m => m.Id == dataEntryPersonId);
            return dataEntryPerson;
        }

    }

}