using AutoMapper;

namespace API.Features.Customers {

    public class CustomerMappingProfile : Profile {

        public CustomerMappingProfile() {
            CreateMap<CustomerWriteDto, Customer>();
        }

    }

}