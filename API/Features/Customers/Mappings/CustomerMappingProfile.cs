using AutoMapper;

namespace API.Features.Customers {

    public class CustomerMappingProfile : Profile {

        public CustomerMappingProfile() {
            CreateMap<Customer, CustomerListVM>();
            CreateMap<Customer, CustomerReadDto>();
            CreateMap<Customer, CustomerActiveVM>();
            CreateMap<CustomerWriteDto, Customer>();
        }

    }

}