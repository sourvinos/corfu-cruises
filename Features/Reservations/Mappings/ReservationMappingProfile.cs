using AutoMapper;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;

namespace BlueWaterCruises.Features.Reservations {

    public class ReservationMappingProfile : Profile {

        public ReservationMappingProfile() {
            // List
            CreateMap<Reservation, ReservationListResource>()
                .ForMember(x => x.RouteAbbreviation, x => x.MapFrom(r => r.PickupPoint.Route.Abbreviation));
            // Read
            CreateMap<Reservation, ReservationReadResource>()
                .ForMember(x => x.PickupPoint, x => x.MapFrom(r => new PickupPointDropdownResource {
                    Id = r.PickupPoint.Id,
                    Description = r.PickupPoint.Description,
                    Port = new PortDropdownResource {
                        Id = r.PickupPoint.Route.Port.Id,
                        Description = r.PickupPoint.Route.Port.Description
                    }
                }));
            CreateMap<Passenger, PassengerReadResource>();
            // Write
            CreateMap<ReservationWriteResource, Reservation>();
            CreateMap<PassengerWriteResource, Passenger>();
        }

    }

}