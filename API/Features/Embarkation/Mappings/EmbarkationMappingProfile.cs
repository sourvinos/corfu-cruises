using System.Linq;
using API.Features.Reservations;
using AutoMapper;

namespace API.Features.Embarkation {

    public class EmbarkationMappingProfile : Profile {

        public EmbarkationMappingProfile() {
            CreateMap<Reservation, EmbarkationFinalVM>()
                .ForMember(x => x.CustomerDescription, x => x.MapFrom(x => x.Customer.Description))
                .ForMember(x => x.DestinationDescription, x => x.MapFrom(x => x.Destination.Description))
                .ForMember(x => x.DriverDescription, x => x.NullSubstitute("(EMPTY)"))
                .ForMember(x => x.PortDescription, x => x.MapFrom(x => x.Port.Description))
                .ForMember(x => x.ShipDescription, x => x.MapFrom(x => x.Ship.Description))
                .ForMember(x => x.TotalPersons, x => x.MapFrom(x => x.TotalPersons))
                .ForMember(x => x.EmbarkedPassengers, x => x.MapFrom(x => x.Passengers.Count(x => x.IsCheckedIn)))
                .ForMember(x => x.EmbarkationStatus, x => x.MapFrom(x => x.TotalPersons - x.Passengers.Count(x => x.IsCheckedIn) == 0 ? "OK" : x.Passengers.All(x => !x.IsCheckedIn) ? "PENDING" : "OKPENDING"))
                .ForMember(x => x.PassengerIds, x => x.MapFrom(x => x.Passengers.Select(x => x.Id)))
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(passenger => new EmbarkationFinalPassengerVM {
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