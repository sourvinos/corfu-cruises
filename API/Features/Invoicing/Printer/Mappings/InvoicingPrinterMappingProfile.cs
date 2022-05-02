using System.Linq;
using AutoMapper;

namespace API.Features.Invoicing.Printer {

    public class InvoicingPrinterMappingProfile : Profile {

        public InvoicingPrinterMappingProfile() {
            CreateMap<InvoicingPrinterDTO, InvoicingPrinterVM>()
                .ForMember(x => x.Date, x => x.MapFrom(x => x.Date))
                .ForMember(x => x.Customer, x => x.MapFrom(x => x.Customer))
                .ForMember(x => x.PortGroup, x => x.MapFrom(x => x.Ports.Select(x => new InvoicingPrinterPortDTO {
                    Port = x.Port,
                    HasTransferGroup = x.HasTransferGroup,
                    Adults = x.Adults,
                    Kids = x.Kids,
                    Free = x.Free,
                    TotalPersons = x.TotalPersons,
                    TotalPassengers = x.TotalPassengers
                })))
                .ForMember(x => x.Reservations, x => x.MapFrom(x => x.Reservations.Select(x => new InvoicingPrinterReservationVM {
                    ReservationId = x.ReservationId,
                    Adults = x.Adults,
                    Kids = x.Kids,
                    Free = x.Free,
                    TotalPersons = x.TotalPersons,
                    TicketNo = x.TicketNo,
                    Remarks = x.Remarks,
                    HasTransfer = x.PickupPoint.CoachRoute.HasTransfer,
                    Destination = x.Destination.Description,
                    Port = x.Port.Description,
                    Ship = x.Ship == null ? "(EMPTY)" : x.Ship.Description,
                })));
        }

    }

}