using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ports {

    public class PortRepository : Repository<Port>, IPortRepository {

        public PortRepository(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        public async Task<IEnumerable<Port>> Get() {
            var records = await context.Ports
                .OrderBy(x => x.StopOrder)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<IEnumerable<Port>> GetActive() {
            var records = await context.Set<Port>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<Port> GetById(int id, bool trackChanges) {
            return await FindByCondition(x => x.Id.Equals(id), trackChanges).SingleOrDefaultAsync();
        }

        public int IsValid(PortWriteDto port) {
            return true switch {
                var x when x == PortSequenceOutOfBounds(port) => 493,
                var x when x == NewRecordAndPortStopOrderExists(port) => 493,
                var x when x == EditRecordAndPortStopOrderExists(port) => 493,
                _ => 200,
            };
        }

        private static bool PortSequenceOutOfBounds(PortWriteDto port) {
            return port.StopOrder <= 0 || port.StopOrder >= 11;
        }

        private bool NewRecordAndPortStopOrderExists(PortWriteDto port) {
            return port.Id == 0 && context.Ports.Where(x => x.StopOrder == port.StopOrder).FirstOrDefaultAsync().Result != null;
        }

        private bool EditRecordAndPortStopOrderExists(PortWriteDto port) {
            return port.Id != 0 && context.Ports.Where(x => x.StopOrder == port.StopOrder && x.Id != port.Id).FirstOrDefaultAsync().Result != null;
        }

    }

}