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
            var genders = await context.Genders
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Gender>, IEnumerable<GenderListVM>>(genders);
        }

        public async Task<IEnumerable<GenderActiveVM>> GetActive() {
            var genders = await context.Genders
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Gender>, IEnumerable<GenderActiveVM>>(genders);
        }

        public new async Task<Gender> GetById(int id) {
            return await context.Genders
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<GenderWriteDto> AttachUserIdToDto(GenderWriteDto gender) {
            var user = await Identity.GetConnectedUserId(httpContext);
            gender.UserId = user.UserId;
            return gender;
        }

    }

}