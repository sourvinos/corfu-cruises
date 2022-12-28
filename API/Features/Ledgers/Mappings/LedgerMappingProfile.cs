using System.Linq;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Ledger {

    public class LedgerMappingProfile : Profile {

        public LedgerMappingProfile() {
            CreateMap<LedgerInitialVM, LedgerFinalVM>()
                .ForMember(x => x.Customer, x => x.MapFrom(x => x.Customer))
                .ForMember(x => x.PortGroup, x => x.MapFrom(x => x.Ports.Select(x => new LedgerInitialPortVM {
                    Port = x.Port,
                    HasTransferGroup = x.HasTransferGroup,
                    Adults = x.Adults,
                    Kids = x.Kids,
                    Free = x.Free,
                    TotalPersons = x.TotalPersons,
                    TotalPassengers = x.TotalPassengers
                })))
                .ForMember(x => x.Reservations, x => x.MapFrom(x => x.Reservations.Select(x => new LedgerFinalReservationVM {
                    Date = DateHelpers.DateToISOString(x.Date),
                    RefNo = x.RefNo,
                    ReservationId = x.ReservationId,
                    Adults = x.Adults,
                    Kids = x.Kids,
                    Free = x.Free,
                    TotalPersons = x.TotalPersons,
                    EmbarkedPassengers = x.Passengers.Count(x => x.IsCheckedIn),
                    TotalNoShow = x.TotalPersons - x.Passengers.Count(x => x.IsCheckedIn),
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