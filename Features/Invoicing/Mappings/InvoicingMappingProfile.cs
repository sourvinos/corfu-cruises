using AutoMapper;

namespace CorfuCruises {

    public class InvoicingMappingProfile : Profile {

        public InvoicingMappingProfile() {
            CreateMap<Reservation, InvoiceViewModel>()
                .ForMember(rr => rr.Destination, opt => opt.MapFrom(r => r.Destination.Description))
                .ForMember(rr => rr.Customer, opt => opt.MapFrom(r => r.Customer.Description))
                .ForMember(rr => rr.PickupPoint, opt => opt.MapFrom(r => r.PickupPoint.Description))
                .ForMember(rr => rr.IsTransfer, opt => opt.MapFrom(r => r.PickupPoint.Route.IsTransfer))
                .ForMember(rr => rr.Ship, opt => opt.MapFrom(r => r.Ship.Description));
        }

    }

}