using System.Linq;
using AutoMapper;

namespace CorfuCruises {

    public class MappingProfile : Profile {

        public MappingProfile() {
            // Read
            CreateMap<Booking, BookingResource>()
                .ForMember(tr => tr.Destination, opt => opt.MapFrom(v => new DestinationResource { Id = v.Destination.Id, Abbreviation = v.Destination.Abbreviation, Description = v.Destination.Description }))
                .ForMember(tr => tr.Driver, opt => opt.MapFrom(v => new DriverResource { Id = v.Driver.Id, Description = v.Driver.Description }))
                .ForMember(tr => tr.PickupPoint, opt => opt.MapFrom(v => new PickupPointResource {
                    Id = v.PickupPoint.Id,
                    Description = v.PickupPoint.Description,
                    ExactPoint = v.PickupPoint.ExactPoint,
                    Time = v.PickupPoint.Time,
                    Route = new RouteResource {
                        Id = v.PickupPoint.Route.Id,
                        Abbreviation = v.PickupPoint.Route.Abbreviation,
                        Description = v.PickupPoint.Route.Description,
                        Port = new PortResource {
                            Id = v.PickupPoint.Route.PortId,
                            Description = v.PickupPoint.Route.Port.Description
                        }
                    }
                }));
        }

    }

}