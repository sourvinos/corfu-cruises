using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Schedules {

    public class ScheduleRepository : Repository<Schedule>, IScheduleRepository {

        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContext;

        public ScheduleRepository(AppDbContext context, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ScheduleListVM>> Get() {
            var schedules = await context.Set<Schedule>()
                .Include(x => x.Destination)
                .Include(x => x.Port)
                .OrderBy(x => x.Date).ThenBy(x => x.Destination.Description).ThenBy(x => x.Port.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Schedule>, IEnumerable<ScheduleListVM>>(schedules);
        }

        public IEnumerable<AvailabilityCalendarGroupVM> GetForCalendar(string fromDate, string toDate) {
            return context.Schedules
                .Where(x => x.Date >= Convert.ToDateTime(fromDate) && x.Date <= Convert.ToDateTime(toDate))
                .GroupBy(x => x.Date)
                .Select(x => new AvailabilityCalendarGroupVM {
                    Date = DateHelpers.DateTimeToISOString(x.Key.Date),
                    Destinations = x.GroupBy(x => new { x.Date, x.Destination.Id, x.Destination.Description, x.Destination.Abbreviation }).Select(x => new DestinationCalendarVM {
                        Id = x.Key.Id,
                        Description = x.Key.Description,
                        Abbreviation = x.Key.Abbreviation,
                        Ports = x.GroupBy(x => new { x.PortId, x.Port.Description, x.Port.Abbreviation, x.MaxPax, x.Port.StopOrder }).OrderBy(x => x.Key.StopOrder).Select(x => new PortCalendarVM {
                            Id = x.Key.PortId,
                            Description = x.Key.Description,
                            MaxPax = x.Key.MaxPax
                        })
                    })
                })
                .ToList();
        }

        public async Task<Schedule> GetById(int id, bool includeTables) {
            return includeTables
                ? await context.Schedules
                    .Include(x => x.Port)
                    .Include(p => p.Destination)
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id)
                : await context.Schedules
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Schedule>> GetRangeByIds(IEnumerable<int> ids) {
            return await context.Schedules
                .Where(x => ids.Contains(x.Id))
                .ToListAsync();
        }

        public async Task<List<ScheduleWriteDto>> AttachUserIdToNewDto(List<ScheduleWriteDto> schedules) {
            var userId = await Identity.GetConnectedUserId(httpContext);
            schedules.ForEach(c => c.UserId = userId);
            return schedules;
        }

        public ScheduleWriteDto AttachUserIdToUpdateDto(ScheduleWriteDto schedule) {
            return Identity.PatchEntityWithUserId(httpContext, schedule);
        }


    }

}