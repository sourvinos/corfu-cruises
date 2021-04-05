using AutoMapper;
using System.Linq;

namespace CorfuCruises {

    public class ReservationMappingProfile : Profile {

        public ReservationMappingProfile() {
            CreateMap<Reservation, ReservationReadResource>()
                .ForMember(rr => rr.Destination, opt => opt.MapFrom(r => new DestinationResource { Id = r.Destination.Id, Abbreviation = r.Destination.Abbreviation, Description = r.Destination.Description }))
                .ForMember(rr => rr.Driver, opt => opt.MapFrom(r => new DriverResource { Id = r.Driver.Id, Description = r.Driver.Description }))
                .ForMember(rr => rr.PickupPoint, opt => opt.MapFrom(r => new PickupPointResource {
                    Id = r.PickupPoint.Id,
                    Description = r.PickupPoint.Description,
                    ExactPoint = r.PickupPoint.ExactPoint,
                    Time = r.PickupPoint.Time,
                    Route = new RouteResource {
                        Id = r.PickupPoint.Route.Id,
                        Abbreviation = r.PickupPoint.Route.Abbreviation,
                        Description = r.PickupPoint.Route.Description,
                        Port = new PortResource {
                            Id = r.PickupPoint.Route.PortId,
                            Description = r.PickupPoint.Route.Port.Description
                        }
                    }
                }));
            CreateMap<ReservationWriteResource, Reservation>();
            CreateMap<PassengerWriteResource, Passenger>();
        }

    }

}