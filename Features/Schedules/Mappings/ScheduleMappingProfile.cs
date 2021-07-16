using AutoMapper;

namespace ShipCruises {

    public class ScheduleMappingProfile : Profile {

        public ScheduleMappingProfile() {
            CreateMap<Schedule, ScheduleReadResource>();
        }

    }

}