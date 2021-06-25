using AutoMapper;
using System.Linq;

namespace CorfuCruises {

    public class EmbarkationMappingProfile : Profile {

        public EmbarkationMappingProfile() {
            CreateMap<Reservation, EmbarkationResource>()
                .ForMember(x => x.Customer, x => x.MapFrom(x => x.Customer.Description))
                .ForMember(x => x.Driver, x => x.MapFrom(x => x.Driver.Description))
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(passenger => new EmbarkationPassengerResource {
                    Id = passenger.Id,
                    Lastname = passenger.Lastname,
                    Firstname = passenger.Firstname,
                    IsCheckedIn = passenger.IsCheckedIn
                })));
        }

    }

}