using System.Collections.Generic;
using System.Linq;
using AutoMapper;

namespace API.Features.Invoicing {

    public class InvoicingMappingProfile : Profile {

        public InvoicingMappingProfile() {
            CreateMap<InvoicingDTO, InvoicingReportVM>()
                .ForMember(x => x.Customer, x => x.MapFrom(x => x.Customer))
                .ForMember(x => x.PortGroup, x => x.MapFrom(x => x.Ports.Select(x => new InvoicingPortDTO {
                    Description = x.Description,
                    HasTransferGroup = x.HasTransferGroup,
                    TotalPersons = x.TotalPersons
                })))
                .ForMember(x => x.Reservations, x => x.MapFrom(x => x.Reservations.Select(x => new InvoicingReservationVM {
                    ReservationId = x.ReservationId,
                    Adults = x.Adults,
                    Kids = x.Kids,
                    Free = x.Free,
                    TotalPersons = x.TotalPersons,
                    TicketNo = x.TicketNo,
                    Remarks = x.Remarks,
                    HasTransfer = x.PickupPoint.CoachRoute.HasTransfer,
                    Destination = x.Destination.Description,
                    Ship = x.Ship == null ? "(EMPTY)" : x.Ship.Description,
                })));
        }

    }

}