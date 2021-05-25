using AutoMapper;

namespace CorfuCruises.Manifest {

    public class ManifestMappingProfile : Profile {

        public ManifestMappingProfile() {
            CreateMap<ManifestViewModel, ManifestResource>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
                .ForMember(dest => dest.ShipResource, opt => opt.MapFrom(src => src.Ship));
        }

    }

}