using System.Linq;
using API.Features.Reservations;
using AutoMapper;

namespace API.Features.Embarkation.Printer {

    public class EmbarkationPrinterMappingProfile : Profile {

        public EmbarkationPrinterMappingProfile() {
            CreateMap<Reservation, EmbarkationPrinterVM>()
                .ForMember(x => x.Customer, x => x.MapFrom(x => x.Customer.Description))
                .ForMember(x => x.Driver, x => x.MapFrom(x => x.Driver.Description))
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(passenger => new EmbarkationPrinterPassengerVM {
                    Lastname = passenger.Lastname,
                    Firstname = passenger.Firstname
                })));
        }

    }

}