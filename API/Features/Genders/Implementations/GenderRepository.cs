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

namespace API.Features.Genders {

    public class GenderRepository : Repository<Gender>, IGenderRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        public GenderRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<GenderListVM>> Get() {
            List<Gender> records = await context.Genders
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Gender>, IEnumerable<GenderListVM>>(records);
        }

        public async Task<IEnumerable<GenderActiveVM>> GetActive() {
            List<Gender> records = await context.Set<Gender>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Gender>, IEnumerable<GenderActiveVM>>(records);
        }

        public async Task<Gender> GetById(int id, bool includeTables) {
            return await context.Genders.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<GenderWriteDto> AttachUserIdToDto(GenderWriteDto driver) {
            var user = await Identity.GetConnectedUserId(httpContext);
            driver.UserId = user.UserId;
            return driver;
        }

    }

}