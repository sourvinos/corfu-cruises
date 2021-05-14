using AutoMapper;

namespace CorfuCruises.Manifest {

    public class ManifestMappingProfile : Profile {

        public ManifestMappingProfile() {
            CreateMap<ManifestViewModel, ManifestResource>();
        }

    }

}