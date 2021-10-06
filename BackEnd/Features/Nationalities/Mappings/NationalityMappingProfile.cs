using AutoMapper;

namespace BlueWaterCruises.Features.Nationalities {

    public class NationalityMappingProfile : Profile {

        public NationalityMappingProfile() {
            CreateMap<Nationality, SimpleResource>();
        }

    }

}