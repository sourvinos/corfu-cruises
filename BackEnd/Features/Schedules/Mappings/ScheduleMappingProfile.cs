using AutoMapper;
using BlueWaterCruises.Infrastructure.Extensions;

namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleMappingProfile : Profile {

        public ScheduleMappingProfile() {
            CreateMap<Schedule, ScheduleReadResource>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateConversions.DateTimeToISOString(x.Date)));
            CreateMap<Schedule, ScheduleListResource>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateConversions.DateTimeToISOString(x.Date)));
            CreateMap<ScheduleWriteResource, Schedule>();
        }

    }

}