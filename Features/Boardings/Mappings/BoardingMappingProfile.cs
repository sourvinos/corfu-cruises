using AutoMapper;
using System.Linq;

namespace CorfuCruises {

    public class BoardingsMappingProfile : Profile {

        public BoardingsMappingProfile() {
            CreateMap<Reservation, BoardingResource>()
                .ForMember(x => x.TicketNo, x => x.MapFrom(x => x.TicketNo))
                .ForMember(x => x.Customer, x => x.MapFrom(x => x.Customer.Description))
                .ForMember(x => x.Driver, x => x.MapFrom(x => x.Driver.Description))
                .ForMember(x => x.Remarks, x => x.MapFrom(x => x.Remarks))
                .ForMember(x => x.TotalPersons, x => x.MapFrom(x => x.TotalPersons))
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(passenger => new BoardingPassengerResource {
                    Id = passenger.Id,
                    Lastname = passenger.Lastname,
                    Firstname = passenger.Firstname,
                    IsCheckedIn = passenger.IsCheckedIn
                })));
        }

    }

}