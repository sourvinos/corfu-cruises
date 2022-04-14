using System.Linq;
using API.Features.Reservations;
using AutoMapper;

namespace API.Features.Embarkation.Display {

    public class EmbarkationDisplayMappingProfile : Profile {

        public EmbarkationDisplayMappingProfile() {
            CreateMap<Reservation, EmbarkationDisplayVM>()
                .ForMember(x => x.Customer, x => x.MapFrom(x => x.Customer.Description))
                .ForMember(x => x.Driver, x => x.MapFrom(x => x.Driver.Description))
                .ForMember(x => x.Ship, x => x.MapFrom(x => x.Ship.Description))
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(passenger => new EmbarkationDisplayPassengerVM {
                    Id = passenger.Id,
                    Lastname = passenger.Lastname,
                    Firstname = passenger.Firstname,
                    NationalityCode = passenger.Nationality.Code,
                    NationalityDescription = passenger.Nationality.Description,
                    IsCheckedIn = passenger.IsCheckedIn
                })));
        }

    }

}