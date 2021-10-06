using AutoMapper;

namespace BlueWaterCruises.Features.Customers {

    public class CustomerMappingProfile : Profile {

        public CustomerMappingProfile() {
            CreateMap<Customer, SimpleResource>();
        }

    }

}