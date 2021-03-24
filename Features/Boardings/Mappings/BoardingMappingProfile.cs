using System.Linq;
using AutoMapper;

namespace CorfuCruises {

    public class BoardingsMappingProfile : Profile {

        public BoardingsMappingProfile() {
            // Read
            CreateMap<BoardingGroup, BoardingGroupResource>()
                .ForMember(dest => dest.Details, opt => opt.MapFrom(src => src.Boardings.Select(detail => new BookingDetailResource {
                    Id = detail.BookingId,
                    BookingId = detail.BookingId,
                    TicketNo = detail.TicketNo
                })));
        }

    }

}