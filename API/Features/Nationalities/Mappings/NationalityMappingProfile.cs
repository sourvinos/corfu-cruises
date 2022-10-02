using AutoMapper;

namespace API.Features.Nationalities {

    public class NationalityMappingProfile : Profile {

        public NationalityMappingProfile() {
            CreateMap<NationalityWriteDto, Nationality>();
        }

    }

}