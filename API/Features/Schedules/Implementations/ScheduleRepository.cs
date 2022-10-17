using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace API.Features.Schedules {

    public class ScheduleRepository : Repository<Schedule>, IScheduleRepository {

        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContext;

        public ScheduleRepository(AppDbContext context, IHttpContextAccessor httpContext, ILogger<Schedule> logger, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, httpContext, logger, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ScheduleListVM>> Get() {
            var schedules = await context.Schedules
                .AsNoTracking()
                .Include(x => x.Destination)
                .Include(x => x.Port)
                .OrderBy(x => x.Date).ThenBy(x => x.Destination.Description).ThenBy(x => x.Port.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Schedule>, IEnumerable<ScheduleListVM>>(schedules);
        }

        public async Task<Schedule> GetById(int id, bool includeTables) {
            return includeTables
                ? await context.Schedules
                    .AsNoTracking()
                    .Include(x => x.Port)
                    .Include(p => p.Destination)
                    .SingleOrDefaultAsync(x => x.Id == id)
                : await context.Schedules
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Schedule>> GetRangeByIds(IEnumerable<int> ids) {
            return await context.Schedules
                .AsNoTracking()
                .Where(x => ids.Contains(x.Id))
                .ToListAsync();
        }

        public List<ScheduleWriteDto> AttachUserIdToDtos(List<ScheduleWriteDto> schedules) {
            schedules.ForEach(x => x = Identity.PatchEntityWithUserId(httpContext, x));
            return schedules;
        }

    }

}