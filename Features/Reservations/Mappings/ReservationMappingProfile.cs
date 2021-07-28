using AutoMapper;
using ShipCruises.Reservations;

namespace ShipCruises {

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
            CreateMap<ReservationWriteResource, Reservation>()
                .ForMember(r => r.Date, opt => opt.MapFrom(wr => wr.Date))
                .ForMember(r => r.DestinationId, opt => opt.MapFrom(wr => wr.DestinationId))
                .ForMember(r => r.CustomerId, opt => opt.MapFrom(wr => wr.CustomerId))
                .ForMember(r => r.PickupPointId, opt => opt.MapFrom(wr => wr.PickupPointId))
                .ForMember(r => r.PortId, opt => opt.MapFrom(wr => wr.PortId))
                .ForMember(r => r.DriverId, opt => opt.MapFrom(wr => wr.DriverId))
                .ForMember(r => r.ShipId, opt => opt.MapFrom(wr => wr.ShipId))
                .ForMember(r => r.TicketNo, opt => opt.MapFrom(wr => wr.TicketNo))
                .ForMember(r => r.Email, opt => opt.MapFrom(wr => wr.Email))
                .ForMember(r => r.Phones, opt => opt.MapFrom(wr => wr.Phones))
                .ForMember(r => r.Adults, opt => opt.MapFrom(wr => wr.Adults))
                .ForMember(r => r.Kids, opt => opt.MapFrom(wr => wr.Kids))
                .ForMember(r => r.Free, opt => opt.MapFrom(wr => wr.Free))
                .ForMember(r => r.Remarks, opt => opt.MapFrom(wr => wr.Remarks))
                .ForMember(r => r.UserId, opt => opt.MapFrom(wr => wr.UserId))
                .ForMember(r => r.Passengers, opt => opt.MapFrom(wr => wr.Passengers));
            CreateMap<PassengerWriteResource, Passenger>();
        }

    }

}