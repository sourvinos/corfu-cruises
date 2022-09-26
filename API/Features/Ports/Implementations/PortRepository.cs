using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ports {

    public class PortRepository : Repository<Port>, IPortRepository {

        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContext;

        public PortRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PortListVM>> Get() {
            var records = await context.Ports
                .OrderBy(x => x.StopOrder)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Port>, IEnumerable<PortListVM>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActive() {
            var records = await context.Set<Port>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Port>, IEnumerable<SimpleResource>>(records);
        }

        public async Task<Port> GetById(int id, bool trackChanges) {
            return await FindByCondition(x => x.Id.Equals(id), trackChanges).SingleOrDefaultAsync();
        }

        public async Task<PortWriteDto> AttachUserIdToRecord(PortWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContext);
            record.UserId = user.UserId;
            return record;
        }

    }

}