using AutoMapper;
using System.Linq;

namespace CorfuCruises {

    public class BoardingsMappingProfile : Profile {

        public BoardingsMappingProfile() {
            CreateMap<Booking, BoardingResource>()
                .ForMember(x => x.TicketNo, x => x.MapFrom(x => x.TicketNo))
                .ForMember(x => x.Remarks, x => x.MapFrom(x => x.Remarks))
                .ForMember(x => x.Details, x => x.MapFrom(x => x.Details.Select(detail => new BoardingDetailResource {
                    Id = detail.Id,
                    Lastname = detail.Lastname,
                    Firstname = detail.Firstname,
                    IsCheckedIn = detail.IsCheckedIn
                })));
        }

    }

}