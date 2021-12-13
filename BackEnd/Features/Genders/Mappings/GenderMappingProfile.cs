using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Genders {

    public class GenderMappingProfile : Profile {

        public GenderMappingProfile() {
            CreateMap<Gender, GenderListResource>();
            CreateMap<Gender, GenderReadResource>();
            CreateMap<Gender, SimpleResource>();
            CreateMap<GenderWriteResource, Gender>();
        }

    }

}