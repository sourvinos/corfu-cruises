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

namespace API.Features.Nationalities {

    public class NationalityRepository : Repository<Nationality>, INationalityRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        public NationalityRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<NationalityListVM>> Get() {
            var nationalities = await context.Nationalities
                .AsNoTracking()
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Nationality>, IEnumerable<NationalityListVM>>(nationalities);
        }

        public async Task<IEnumerable<NationalityActiveVM>> GetActive() {
            var nationalities = await context.Nationalities
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Nationality>, IEnumerable<NationalityActiveVM>>(nationalities);
        }

        public new async Task<Nationality> GetById(int id) {
            return await context.Nationalities
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public NationalityWriteDto AttachUserIdToDto(NationalityWriteDto nationality) {
            return Identity.PatchEntityWithUserId(httpContext, nationality);
        }

    }

}