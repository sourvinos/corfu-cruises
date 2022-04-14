using System.Linq;
using AutoMapper;

namespace API.Features.Invoicing {

    public class InvoicingMappingProfile : Profile {

        public InvoicingMappingProfile() {
            // CreateMap<InvoiceIntermediateVM, InvoiceVM>()
            //     .ForMember(x => x.Customer, opt => opt.MapFrom(x => x.Customer))
            //     .ForMember(x => x.Reservations, x => x.MapFrom(x => x.Reservations.Select(hasTransfer => new {
            //         hasTransfer.ReservationId,
            //         hasTransfer.Adults,
            //         hasTransfer.Kids,
            //         hasTransfer.Free,
            //         hasTransfer.TotalPersons,
            //         hasTransfer.TicketNo,
            //         hasTransfer.Remarks,
            //         DestinationDescription = hasTransfer.Destination.Description,
            //         ShipDescription = hasTransfer.Ship == null ? "EMPTY" : hasTransfer.Ship.Description,
            //         hasTransfer.PickupPoint.CoachRoute.HasTransfer
            //     })));
        }

    }

}