using System.Linq;
using AutoMapper;

namespace BlueWaterCruises.Features.Invoicing {

    public class InvoicingMappingProfile : Profile {

        public InvoicingMappingProfile() {
            CreateMap<InvoiceIntermediateViewModel, InvoiceViewModel>()
                .ForMember(x => x.CustomerResource, opt => opt.MapFrom(x => x.Customer))
                .ForMember(x => x.Reservations, x => x.MapFrom(x => x.Reservations.Select(isTransfer => new {
                    isTransfer.ReservationId,
                    isTransfer.Adults,
                    isTransfer.Kids,
                    isTransfer.Free,
                    isTransfer.TotalPersons,
                    isTransfer.TicketNo,
                    isTransfer.Remarks,
                    DestinationDescription = isTransfer.Destination.Description,
                    ShipDescription = isTransfer.Ship.Description,
                    isTransfer.PickupPoint.Route.IsTransfer
                })));
        }

    }

}