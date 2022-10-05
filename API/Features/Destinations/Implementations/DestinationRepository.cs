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

namespace API.Features.Destinations {

    public class DestinationRepository : Repository<Destination>, IDestinationRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        public DestinationRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<DestinationListVM>> Get() {
            var destinations = await context.Destinations
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Destination>, IEnumerable<DestinationListVM>>(destinations);
        }

        public async Task<IEnumerable<DestinationActiveVM>> GetActive() {
            var destinations = await context.Destinations
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Destination>, IEnumerable<DestinationActiveVM>>(destinations);
        }

        public new async Task<Destination> GetById(int id) {
            return await context.Destinations
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

         public DestinationWriteDto AttachUserIdToDto(DestinationWriteDto destination) {
            return Identity.PatchEntityWithUserId(httpContext, destination);
        }

    }

}