using AutoMapper;

namespace BlueWaterCruises.Features.Genders {

    public class GenderMappingProfile : Profile {

        public GenderMappingProfile() {
            CreateMap<Gender, SimpleResource>();
        }

    }

}