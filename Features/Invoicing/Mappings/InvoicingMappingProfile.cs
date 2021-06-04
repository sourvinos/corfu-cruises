using System.Linq;
using AutoMapper;

namespace CorfuCruises {

    public class InvoicingMappingProfile : Profile {

        public InvoicingMappingProfile() {
            CreateMap<InvoiceIntermediateViewModel, InvoiceViewModel>()
                .ForMember(x => x.CustomerDescription, opt => opt.MapFrom(x => x.Customer.Description))
                .ForMember(x => x.Reservations, x => x.MapFrom(x => x.Reservations.Select(isTransfer => new {
                    ReservationId = isTransfer.ReservationId,
                    Adults = isTransfer.Adults,
                    Kids = isTransfer.Kids,
                    Free = isTransfer.Free,
                    TotalPersons = isTransfer.TotalPersons,
                    TicketNo = isTransfer.TicketNo,
                    DestinationDescription = isTransfer.Destination.Description,
                    IsTransfer = isTransfer.PickupPoint.Route.IsTransfer
                })));
        }

    }

}