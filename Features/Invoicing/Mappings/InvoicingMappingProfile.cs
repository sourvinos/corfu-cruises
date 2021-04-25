using AutoMapper;

namespace CorfuCruises {

    public class InvoicingMappingProfile : Profile {

        public InvoicingMappingProfile() {
            CreateMap<Reservation, InvoicingReadResource>()
                .ForMember(rr => rr.CustomerDescription, opt => opt.MapFrom(r => r.Customer.Description))
                .ForMember(rr => rr.DestinationDescription, opt => opt.MapFrom(r => r.Destination.Description))
                .ForMember(rr => rr.ShipDescription, opt => opt.MapFrom(r => r.Ship.Description))
                .ForMember(rr => rr.IsTransfer, opt => opt.MapFrom(r => r.PickupPoint.Route.IsTransfer));
        }

    }

}