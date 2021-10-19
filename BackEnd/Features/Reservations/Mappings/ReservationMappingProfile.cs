using AutoMapper;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;

namespace BlueWaterCruises.Features.Reservations {

    public class ReservationMappingProfile : Profile {

        public ReservationMappingProfile() {
            // List
            CreateMap<Reservation, ReservationListResource>()
                .ForMember(x => x.RouteAbbreviation, x => x.MapFrom(r => r.PickupPoint.Route.Abbreviation))
                .ForMember(x => x.Time, x => x.MapFrom(r => r.PickupPoint.Time));
            // Read
            CreateMap<Reservation, ReservationReadResource>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateConversions.DateTimeToISOString(x.Date)))
                .ForMember(x => x.PickupPoint, x => x.MapFrom(r => new PickupPointWithPortDropdownResource {
                    Id = r.PickupPoint.Id,
                    Description = r.PickupPoint.Description,
                    ExactPoint = r.PickupPoint.ExactPoint,
                    Time = r.PickupPoint.Time,
                    Port = new SimpleResource {
                        Id = r.PickupPoint.Route.Port.Id,
                        Description = r.PickupPoint.Route.Port.Description
                    }
                }));
            CreateMap<Passenger, PassengerReadResource>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateConversions.DateTimeToISOString(x.Birthdate)));
            // Write
            CreateMap<ReservationWriteResource, Reservation>();
            CreateMap<PassengerWriteResource, Passenger>();
        }

    }

}