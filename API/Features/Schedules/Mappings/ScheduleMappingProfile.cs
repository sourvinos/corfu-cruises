using API.Infrastructure.Extensions;
using AutoMapper;

namespace API.Features.Schedules {

    public class ScheduleMappingProfile : Profile {

        public ScheduleMappingProfile() {
            CreateMap<Schedule, ScheduleReadResource>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(x.Date)));
            CreateMap<Schedule, ScheduleListResource>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(x.Date)));
            CreateMap<ScheduleWriteResource, Schedule>();
        }

    }

}