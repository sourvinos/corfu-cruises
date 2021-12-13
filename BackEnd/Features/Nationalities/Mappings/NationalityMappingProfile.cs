using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Nationalities {

    public class NationalityMappingProfile : Profile {

        public NationalityMappingProfile() {
            CreateMap<Nationality, NationalityListResource>();
            CreateMap<Nationality, NationalityReadResource>();
            CreateMap<Nationality, SimpleResource>();
            CreateMap<NationalityWriteResource, Nationality>();
        }

    }

}