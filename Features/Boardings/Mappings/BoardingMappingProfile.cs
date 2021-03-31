using AutoMapper;
using System.Linq;

namespace CorfuCruises {

    public class BoardingsMappingProfile : Profile {

        public BoardingsMappingProfile() {
            CreateMap<Rsv, BoardingResource>()
                .ForMember(x => x.TicketNo, x => x.MapFrom(x => x.TicketNo))
                .ForMember(x => x.Remarks, x => x.MapFrom(x => x.Remarks))
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(detail => new BoardingPassengerResource {
                    Id = detail.Id,
                    Lastname = detail.Lastname,
                    Firstname = detail.Firstname,
                    IsCheckedIn = detail.IsCheckedIn
                })));
        }

    }

}