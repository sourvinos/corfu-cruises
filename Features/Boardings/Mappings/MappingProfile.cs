using System.Linq;
using AutoMapper;

namespace CorfuCruises {

    public class BoardingsMappingProfile : Profile {

        public BoardingsMappingProfile() {
            // Read
            CreateMap<Booking, BoardingResource>()
                .ForMember(dest => dest.Details, opt => opt.MapFrom(src => src.Details.Select(detail => new BookingDetail {
                    Id = detail.Id,
                    BookingId = detail.BookingId,
                    Lastname = detail.Lastname,
                    Firstname = detail.Firstname,
                    IsCheckedIn = detail.IsCheckedIn
                })));
        }

    }

}