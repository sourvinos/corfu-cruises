using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Customers {

    public class CustomerMappingProfile : Profile {

        public CustomerMappingProfile() {
            CreateMap<Customer, CustomerListDto>();
            CreateMap<Customer, CustomerReadDto>();
            CreateMap<Customer, SimpleResource>();
            CreateMap<CustomerWriteDto, Customer>();
        }

    }

}