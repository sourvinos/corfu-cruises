using AutoMapper;

namespace BlueWaterCruises.Features.Customers {

    public class CustomerMappingProfile : Profile {

        public CustomerMappingProfile() {
            CreateMap<Customer, CustomerListResource>();
            CreateMap<Customer, CustomerReadResource>();
            CreateMap<Customer, SimpleResource>();
            CreateMap<CustomerWriteResource, Customer>();
        }

    }

}