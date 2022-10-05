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

namespace API.Features.Registrars {

    public class RegistrarRepository : Repository<Registrar>, IRegistrarRepository {

        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContext;

        public RegistrarRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<RegistrarListVM>> Get() {
            var registrars = await context.Registrars
                .Include(x => x.Ship)
                .OrderBy(x => x.Ship.Description).ThenBy(x => !x.IsPrimary).ThenBy(x => x.Fullname)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<RegistrarListVM>>(registrars);
        }

        public async Task<IEnumerable<RegistrarActiveVM>> GetActive() {
            var registrars = await context.Registrars
                .Where(x => x.IsActive)
                .OrderBy(x => x.Fullname)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<RegistrarActiveVM>>(registrars);
        }

        public async Task<Registrar> GetById(int id, bool includeTables) {
            return includeTables
                ? await context.Registrars
                    .Include(x => x.Ship)
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id)
                : await context.Registrars
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id);
        }

        public RegistrarWriteDto AttachUserIdToDto(RegistrarWriteDto registrar) {
            return Identity.PatchEntityWithUserId(httpContext, registrar);
        }

    }

}