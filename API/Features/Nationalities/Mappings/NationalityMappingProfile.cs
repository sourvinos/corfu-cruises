using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Nationalities {

    public class NationalityMappingProfile : Profile {

        public NationalityMappingProfile() {
            CreateMap<Nationality, NationalityListResource>();
            CreateMap<Nationality, NationalityReadResource>();
            CreateMap<Nationality, SimpleResource>();
            CreateMap<NationalityWriteResource, Nationality>();
        }

    }

}