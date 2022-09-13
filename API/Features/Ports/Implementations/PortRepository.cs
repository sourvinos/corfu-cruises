using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using API.Infrastructure.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ports {

    public class PortRepository : Repository<Port>, IPortRepository {

        public PortRepository(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        public async Task<IEnumerable<Port>> Get() {
            var records = await context.Ports
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<IEnumerable<Port>> GetActiveForDropdown() {
            var records = await context.Set<Port>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<Port> GetByIdToDelete(int id) {
            var record = await context.Ports.SingleOrDefaultAsync(x => x.Id == id);
            if (record != null) {
                return record;
            } else {
                throw new CustomException { ResponseCode = 404 };
            }
        }

    }

}