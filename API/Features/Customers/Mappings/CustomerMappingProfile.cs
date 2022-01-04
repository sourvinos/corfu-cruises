using API.Infrastructure.Classes;
using AutoMapper;

namespace API.Features.Customers {

    public class CustomerMappingProfile : Profile {

        public CustomerMappingProfile() {
            CreateMap<Customer, CustomerListResource>();
            CreateMap<Customer, CustomerReadResource>();
            CreateMap<Customer, SimpleResource>();
            CreateMap<CustomerWriteResource, Customer>();
        }

    }

}