using AutoMapper;

namespace CorfuCruises {

    public class DataEntryPersonMappingProfile : Profile {

        public DataEntryPersonMappingProfile() {
            CreateMap<DataEntryPerson, DataEntryPersonReadResource>();
            CreateMap<DataEntryPersonWriteResource, DataEntryPerson>();
        }

    }

}