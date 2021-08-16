using AutoMapper;

namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleMappingProfile : Profile {

        public ScheduleMappingProfile() {
            CreateMap<Schedule, ScheduleReadResource>();
        }

    }

}