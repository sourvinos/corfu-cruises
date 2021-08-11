using AutoMapper;

namespace ShipCruises.Features.Reservations {

    public class ReservationMappingProfile : Profile {

        public ReservationMappingProfile() {
            CreateMap<Reservation, ReservationReadResource>()
                .ForMember(x => x.CustomerDescription, opt => opt.MapFrom(r => r.Customer.Description))
                .ForMember(x => x.DestinationAbbreviation, opt => opt.MapFrom(r => r.Destination.Abbreviation))
                .ForMember(x => x.DestinationDescription, opt => opt.MapFrom(r => r.Destination.Description))
                .ForMember(x => x.DriverDescription, opt => opt.MapFrom(r => r.Driver.Description))
                .ForMember(x => x.PickupPointDescription, opt => opt.MapFrom(r => r.PickupPoint.Description))
                .ForMember(x => x.RouteAbbreviation, opt => opt.MapFrom(r => r.PickupPoint.Route.Abbreviation))
                .ForMember(x => x.PortDescription, opt => opt.MapFrom(r => r.PickupPoint.Route.Port.Description))
                .ForMember(x => x.ShipDescription, opt => opt.MapFrom(r => r.Ship.Description))
                .ForMember(x => x.User, opt => opt.MapFrom(r => r.User.DisplayName));
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