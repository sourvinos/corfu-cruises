using AutoMapper;

namespace ShipCruises.Features.Reservations {

    public class ReservationMappingProfile : Profile {

        public ReservationMappingProfile() {
            // List
            CreateMap<Reservation, ReservationListResource>()
                .ForMember(x => x.RouteAbbreviation, x => x.MapFrom(r => r.PickupPoint.Route.Abbreviation));
            // Read
            CreateMap<Reservation, ReservationReadResource>()
                .ForMember(x => x.PickupPoint, x => x.MapFrom(r => new PickupPointResource {
                    Id = r.PickupPoint.Id,
                    Description = r.PickupPoint.Description,
                    Port = new PortResource {
                        Id = r.PickupPoint.Route.Port.Id,
                        Description = r.PickupPoint.Route.Port.Description
                    }
                }));
            // Write
            CreateMap<ReservationWriteResource, Reservation>();
            CreateMap<PassengerWriteResource, Passenger>();
        }

    }

}