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

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        public PortRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PortListVM>> Get() {
            var ports = await context.Ports
                .OrderBy(x => x.StopOrder)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Port>, IEnumerable<PortListVM>>(ports);
        }

        public async Task<IEnumerable<PortActiveVM>> GetActive() {
            var ports = await context.Ports
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Port>, IEnumerable<PortActiveVM>>(ports);
        }

        public new async Task<Port> GetById(int id) {
            return await context.Ports
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public PortWriteDto AttachUserIdToDto(PortWriteDto port) {
            return Identity.PatchEntityWithUserId(httpContext, port);
        }
    }

}