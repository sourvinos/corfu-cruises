using System.Linq;
using AutoMapper;

namespace BlueWaterCruises.Features.Invoicing {

    public class InvoicingMappingProfile : Profile {

        public InvoicingMappingProfile() {
            CreateMap<InvoiceIntermediateViewModel, InvoiceViewModel>()
                .ForMember(x => x.CustomerResource, opt => opt.MapFrom(x => x.Customer))
                .ForMember(x => x.Reservations, x => x.MapFrom(x => x.Reservations.Select(isTransfer => new {
                    ReservationId = isTransfer.ReservationId,
                    Adults = isTransfer.Adults,
                    Kids = isTransfer.Kids,
                    Free = isTransfer.Free,
                    TotalPersons = isTransfer.TotalPersons,
                    TicketNo = isTransfer.TicketNo,
                    Remarks = isTransfer.Remarks,
                    DestinationDescription = isTransfer.Destination.Description,
                    ShipDescription = isTransfer.Ship.Description,
                    IsTransfer = isTransfer.PickupPoint.Route.IsTransfer
                })));
        }

    }

}