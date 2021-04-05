using AutoMapper;

namespace CorfuCruises {

    public class ScheduleMappingProfile : Profile {

        public ScheduleMappingProfile() {
            CreateMap<Schedule, ScheduleReadResource>();
        }

    }

}